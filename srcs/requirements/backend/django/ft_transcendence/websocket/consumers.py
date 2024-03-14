# chat/consumers.py
import json
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from datetime import datetime
import pytz

class Session:
    def __init__(self, session_id, creator_username, is_private, level):
        self.session_id = session_id
        self.creator_username = creator_username
        self.is_private = is_private
        self.level = level
        self.players = []

    def to_json(self):
        return {
            "sessionId": self.session_id,
            "CreatorUsername": self.creator_username,
            "isPrivate": self.is_private,
            "level": self.level,
            "players": self.players
        }

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, username):
        for player in self.players:
            if player == username:
                self.players.remove(player)
                return True
        return False

sessions = []

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        query_params = parse_qs(self.scope['query_string'].decode())
        self.user_username = query_params.get('user_username', [None])[0]


        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        print(self.user_username, " c est co")

        remove_player_sessions(self.user_username)

        sessions_json = convert_list_json()
        await self.channel_layer.group_send(
            self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
        )

    async def disconnect(self, close_code):

        # Leave room group
        print(self.user_username, " c est deco")
        fuseau = pytz.timezone("Europe/Paris")
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.disconnect", "user_username": self.user_username, "time": datetime.now().astimezone(fuseau).strftime("%H:%M:%S")}
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)

        messageType = data["messageType"]



        if (messageType == "classic"):
            message = data["message"]
            # owner = text_data_json["owner"]
            time = data["time"]
            # print (f"User {self.user_username} connected to room {self.room_name}")
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message" ,"messageType": messageType, "message": message, "owner": self.user_username, "time": time}
            )




        if (messageType == "createSession"):
            if (search_player_in_game(self.user_username)):
                print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmCreat",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                    }
                )

            else:
                level = data["level"]
                sessionId = str(uuid.uuid4())

                session = Session(sessionId, self.user_username, "false", level)
                session.add_player(self.user_username)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmCreat",
                        "confirme": "true",
                        "username": self.user_username,
                        "players": self.user_username
                    }
                )

                print("Session created :", sessionId, self.user_username, level)

                sessions.append(session)


                sessions_json = convert_list_json()

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
                )




        if(messageType == "join"):

            if (search_player_in_game(self.user_username)):
                print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmJoin",
                        "confirme": "true",
                        "username": self.user_username,
                        "players": self.user_username
                    }
                )

            else:
                session = find_session_by_id(data["sessionId"])
                session.add_player(self.user_username)

                print(session.players)


                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm_join",
                        "messageType": "confirmJoin",
                        "confirme": True,
                        "username": self.user_username,
                        "players": session.players
                    }
                )


        if (messageType == "quitSession"):
            remove_player_sessions(self.user_username)
            sessions_json = convert_list_json()
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
            )

        if(messageType == "updateBallPositions"):
            session = search_player_in_game(self.user_username)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "position.Ball",
                    "messageType": "positionBall",
                    "players": session.players,
                    "ballX": data["ballX"],
                    "ballY": data["ballY"],
                    "username": self.user_username
                }
            )

    async def position_Ball(self, event):
        message_type = event.get("messageType")

        username = event.get("username")
        players = event.get("players")
        for player in players:
            if player == self.user_username and username != self.user_username:
                print("ballx ", event.get("ballX"))
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'ballX': event.get("ballX"),
                    'ballY': event.get("ballY")
                }))



    async def confirm_creat(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        player = event.get("players")
        if player == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'username': event.get("username"),
                'confirme': confirme
            }))



    async def confirm_join(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        players = event.get("players")
        print(players)
        for player in players:
            print(player)
            if player == self.user_username:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'username': event.get("username"),
                    'confirme': confirme
                }))



    async def session_list(self, event):
        messageType = event["messageType"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"messageType" : messageType, "sessions": event["session"]}))



    # Receive message from room group
    async def chat_message(self, event):
        messageType = event["messageType"]
        message = event["message"]
        owner = event["owner"]
        time = event["time"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "owner": owner, "messageType" : messageType, "time": time}))

    async def chat_disconnect(self, event):
        # Envoyer un message pour informer que l'utilisateur s'est déconnecté
        owner = event["user_username"]
        time = event["time"]
        await self.send(
            text_data=json.dumps(
                {"message": "", "owner": owner, "messageType": "offline", "time": time}
            )
        )




def search_player_in_game(username):
    for session in sessions:
        for player in session.players:
            if player == username:
                return session
    return False

def remove_player_sessions(username):
    for session in sessions:
        for player in session.players:
            if player == username:
                session.remove_player(username)
                if not session.players:
                    sessions.remove(session)
                    print(sessions)
    return False


def find_session_by_id(session_id):
    for session in sessions:
        if session.session_id == session_id:
            return session
    return None


def convert_list_json():
    sessions_json = []
    for session in sessions:
        sessions_json.append(session.to_json())
    sessions_json2 = json.dumps(sessions_json)
    return(sessions_json2)
