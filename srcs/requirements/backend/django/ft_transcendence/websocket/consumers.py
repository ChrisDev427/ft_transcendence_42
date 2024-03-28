# chat/consumers.py
import json
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from datetime import datetime
from game.models import Game
from game import serializers
from account.models import UserProfile
from asgiref.sync import sync_to_async
from django.core.serializers import serialize
import pytz
fuseau = pytz.timezone('Europe/Paris')

class Session:
    def __init__(self, session_id, creator_username, peer_creator, is_private, level, paddleHeight):
        self.session_id = session_id
        self.creator_username = creator_username
        self.peer_creator = peer_creator,
        self.is_private = is_private
        self.level = level
        self.players = []
        self.paddleHeight = paddleHeight

    def to_json(self):
        return {
            "sessionId": self.session_id,
            "CreatorUsername": self.creator_username,
            "CreatorPeerId": self.peer_creator,
            "isPrivate": self.is_private,
            "level": self.level,
            "players": self.players,
            "paddleHeight": self.paddleHeight
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
            self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json, }
        )

    async def disconnect(self, close_code):

        # Leave room group
        print(self.user_username, " c est deco")
        session=search_player_in_game(self.user_username)
        if session:
            remove_player_sessions(self.user_username)
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.surrender" ,"messageType": "surrenderSession", "session": session.to_json(), "username" : self.user_username}
            )
            

        # fuseau = pytz.timezone("Europe/Paris")
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.disconnect", "user_username": self.user_username, "time": datetime.now().astimezone(fuseau).strftime("%H:%M:%S")}
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)

        print("sessions = ", sessions)
        messageType = data["messageType"]

        if (messageType == "classic" or messageType == "online"):
            message = data["message"]
            # owner = text_data_json["owner"]
            time = data["time"]
            # print (f"User {self.user_username} connected to room {self.room_name}")
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message" ,"messageType": messageType, "message": message, "owner": self.user_username, "time": time}
            )



        if (messageType == "sendMessageSession"):
            sessionUsername = data["sessionUsername"]
            message = data["message"]
            time = data["time"]
            session = search_player_in_game(sessionUsername)

            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.session" ,"messageType": "messageSession", "message": message, "owner": self.user_username, "time": time, "players": session.players}
            )


        if (messageType == "inviteSession"):
            if (search_player_in_game(self.user_username)):
                print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.invite",
                        "messageType": "confirmInvite",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                        "CreatorPeerId" : data["peerId"]
                    }
                )

            else:
                level = data["level"]
                creatorPeer = data["peerId"]
                sessionId = str(uuid.uuid4())

                session = Session(sessionId, self.user_username, creatorPeer, "true", level, data["paddleHeight"])
                session.add_player(self.user_username)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.invite",
                        "messageType": "confirmInvite",
                        "confirme": "true",
                        "username": self.user_username,
                        "creatorPeer": creatorPeer,
                        "players": self.user_username,
                        "sessionId": sessionId,
                    }
                )

                print("Session created :", sessionId, self.user_username, level,)

                sessions.append(session)


                usernameInvited = data["usernameInvited"]

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "invite.Session" ,"messageType": "inviteSession", "session": session.to_json(), "usernameInvited": usernameInvited}
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
                        "CreatorPeerId" : data["peerId"]
                    }
                )

            else:
                level = data["level"]
                creatorPeer = data["peerId"]
                sessionId = str(uuid.uuid4())

                session = Session(sessionId, self.user_username, creatorPeer, "false", level, data["paddleHeight"])
                session.add_player(self.user_username)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmCreat",
                        "confirme": "true",
                        "username": self.user_username,
                        "creatorPeer": creatorPeer,
                        "players": self.user_username,
                        "sessionId": sessionId,
                    }
                )

                print("Session created :", sessionId, self.user_username, level,)

                sessions.append(session)


                sessions_json = convert_list_json()

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
                )

        if(messageType == "playerPeer"):
            sessionId = data["sessionId"]
            session = find_session_by_id(sessionId)
            session_json = convert_list_json()
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "send.playerPeer",
                        "messageType": "receivePlayerPeer",
                        "players": session.players,
                        "playerPeer": data["playerPeer"],
                        "sessionCreator": session.creator_username,
                        "session" : session_json
                    }
                )

        if(messageType == "join"):

            print("sessions = ", sessions)
            if (search_player_in_game(self.user_username)):
                print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmJoin",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                    }
                )

            else:
                session = find_session_by_id(data["sessionId"])
                session.add_player(self.user_username)


                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm_join",
                        "messageType": "confirmJoin",
                        "confirme": "true",
                        "username": self.user_username,
                        "peerCreator": session.peer_creator,
                        "players": session.players,
                        "sessionUsername": session.creator_username,
                        "sessionId": session.session_id
                    }
                )


        if (messageType == "quitSession"):
            remove_player_sessions(self.user_username)
            sessions_json = convert_list_json()
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
            )

        if (messageType == "surrenderSession"):
            session = search_player_in_game(self.user_username)
            # session.players.remove(self.user_username)
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.surrender" ,"messageType": messageType, "session": session.to_json(), "username" : self.user_username}
            )


        # if (messageType == "values"):
        #     session = search_player_in_game(self.user_username)

        #     await self.channel_layer.group_send(
        #         self.room_group_name,
        #         {
        #             "type": "value.game",
        #             "messageType": "values",
        #             "players": session.players,
        #             "spaceBarPressed":data["spaceBarPressed"],
        #             "leftPaddleHand": data["leftPaddleHand"],
        #             "rightPaddleHand": data["rightPaddleHand"],
        #             "leftPlayerScore": data["leftPlayerScore"],
        #             "rightPlayerScore": data["rightPlayerScore"],
        #             "ballLaunched": data["ballLaunched"],
        #             "username": self.user_username
        #         }
        #     )


        # if(messageType == "updateBallPositions"):
        #     session = search_player_in_game(self.user_username)

        #     await self.channel_layer.group_send(
        #         self.room_group_name,
        #         {
        #             "type": "position.Ball",
        #             "messageType": "positionBall",
        #             "players": session.players,
        #             "ballX": data["ballX"],
        #             "ballY": data["ballY"],
        #             "username": self.user_username
        #         }
        #     )

        # if (messageType == "updatePaddlePositions"):
        #     session = search_player_in_game(self.user_username)

        #     await self.channel_layer.group_send(
        #         self.room_group_name,
        #         {
        #             "type": "position.Paddle",
        #             "messageType": "position",
        #             "players": session.players,
        #             "pos": data["pos"],
        #             "cote": data["cote"],
        #             "username": self.user_username,
        #             "time": data["time"]
        #         }
        #     )

        if (messageType == "endGame") :
            session = search_player_in_game(data["sessionUsername"])
            final_score = str(data["leftPlayerScore"]) + ":" + str(data["rightPlayerScore"]);
            winner = await get_user_profile(data.get("winner"))
            player_one = await get_user_profile(session.creator_username)
            player_two = await get_user_profile(session.players[1])
            await update_game(player_one, player_two, winner, final_score)
            sessions.remove(session)


    async def session_surrender(self, event):
        messageType = event.get("messageType")
        session = event.get("session")
        players = session["players"]
        username = event.get("username")
        # Send message to WebSocket
        for player in players:
            if player == self.user_username and username != self.user_username:
                await self.send(text_data=json.dumps({"messageType" : messageType, "session": session}))

    async def chat_session(self, event):
        players = event.get("players")
        messageType = event["messageType"]
        message = event["message"]
        owner = event["owner"]
        time = event["time"]
        # Send message to WebSocket
        for player in players:
            if player == self.user_username:
                await self.send(text_data=json.dumps({"message": message, "owner": owner, "messageType" : messageType, "time": time}))

    # async def value_game(self, event):
    #     message_type = event.get("messageType")

    #     username = event.get("username")
    #     players = event.get("players")
    #     for player in players:
    #         if player == self.user_username and username != self.user_username:
    #             await self.send(text_data=json.dumps({
    #                 'messageType': message_type,
    #                 'spaceBarPressed': event.get("spaceBarPressed"),
    #                 'leftPaddleHand': event.get("leftPaddleHand"),
    #                 'rightPaddleHand': event.get("rightPaddleHand"),
    #                 'leftPlayerScore': event.get("leftPlayerScore"),
    #                 'rightPlayerScore': event.get("rightPlayerScore"),
    #                 'ballLaunched': event.get("ballLaunched"),
    #                 'pos': event.get("pos"),
    #                 'cote': event.get("cote")
    #             }))


    # async def position_Paddle(self, event):
    #     message_type = event.get("messageType")
    #     username = event.get("username")
    #     print("user =",username,  event.get("time"), datetime.now().astimezone(pytz.timezone("Europe/Paris")))
    #     players = event.get("players")
    #     for player in players:
    #         if player == self.user_username and username != self.user_username:
    #             await self.send(text_data=json.dumps({
    #                 'messageType': message_type,
    #                 'pos': event.get("pos"),
    #                 'cote': event.get("cote")
    #             }))


    # async def position_Ball(self, event):
    #     message_type = event.get("messageType")

    #     username = event.get("username")
    #     players = event.get("players")
    #     for player in players:
    #         if player == self.user_username and username != self.user_username:
    #             await self.send(text_data=json.dumps({
    #                 'messageType': message_type,
    #                 'ballX': event.get("ballX"),
    #                 'ballY': event.get("ballY")
    #             }))


    async def confirm_creat(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        player = event.get("players")
        if player == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'username': event.get("username"),
                'confirme': confirme,
                'sessionId': event.get("sessionId"),
            }))

    async def confirm_invite(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        player = event.get("players")
        if player == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'username': event.get("username"),
                'confirme': confirme,
                'sessionId': event.get("sessionId"),
            }))

    async def confirm_join(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")
        sessionCreator = event.get("sessionUsername")
        sessionId = event.get("sessionId")

        players = event.get("players")
        session = find_session_by_id(sessionId)

        for player in players:
            if player == self.user_username and player != sessionCreator:
                difficulty = ""
                if session.level == 3:
                    difficulty = "easy"
                elif session.level == 5:
                    difficulty = "medium"
                elif session.level == 7:
                    difficulty = "hard"
                gameData = {
                    "player_one" : sessionCreator,
                    "player_two" : players[1],
                    "game_type" : "pvp",
                    "difficulty" : difficulty,
                }
                serializer = serializers.GameSerializer(data=gameData, partial=True)
                if serializer.is_valid():
                    player_one = await get_user_profile(gameData.get("player_one"))
                    player_two = await get_user_profile(gameData.get("player_two"))
                    serializer.validated_data['player_one'] = player_one
                    serializer.validated_data['player_two'] = player_two
                    await update_user_profile(player_one)
                    await update_user_profile(player_two)
                    await create_game(serializer)

                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'username': event.get("username"),
                    'confirme': confirme,
                    'peerCreator': event.get("peerCreator"),
                    'sessionId': sessionId,
                }))


    async def send_playerPeer(self, event):
        message_type = event.get("messageType")
        players = event.get("players")
        playerPeer = event.get("playerPeer")
        sessionCreator = event.get("sessionCreator")

        for player in players:
            if player == self.user_username and player == sessionCreator:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'playerPeer': playerPeer,
                    'player' : players[1]
                }))



    async def invite_Session(self, event):
        messageType = event["messageType"]
        usernameInvited = event["usernameInvited"]
        # Send message to WebSocket
        if usernameInvited == self.user_username:
            await self.send(text_data=json.dumps({"messageType" : messageType, "session": event["session"]}))



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

@sync_to_async
def get_user_profile(username):
    return UserProfile.objects.get(user__username=username)

@sync_to_async
def update_user_profile(player):
    player.is_ingame = True
    player.save()


@sync_to_async
def create_game(serializer):
    serializer.save()

@sync_to_async
def update_game(player_one, player_two, winner, final_score):
    findGame = Game.objects.filter(player_one=player_one, player_two=player_two, winner=None).first()
    findGame.winner = winner
    findGame.final_score = final_score
    findGame.save()
    player_one.games_id.add(findGame.id)
    player_two.games_id.add(findGame.id)
    if winner == player_one:
        player_one.win += 1
        player_two.lose += 1
    else :
        player_two.win += 1
        player_one.lose += 1
    player_two.is_ingame = False
    player_one.is_ingame = False
    player_one.save()
    player_two.save()
