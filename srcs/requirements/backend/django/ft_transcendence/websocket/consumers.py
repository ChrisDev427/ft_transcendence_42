# chat/consumers.py
import json
import pytz
fuseau_france = pytz.timezone('Europe/Paris')
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from datetime import datetime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        query_params = parse_qs(self.scope['query_string'].decode())
        self.user_username = query_params.get('user_username', [None])[0]
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.disconnect", "user_username": self.user_username, "time": datetime.now(fuseau_france).strftime("%H:%M:%S")}
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        messageType = text_data_json["messageType"]
        time = text_data_json["time"]
        # print (f"User {self.user_username} connected to room {self.room_name}")
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message" ,"messageType": messageType, "message": message, "owner": self.user_username, "time": time}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        messageType = event["messageType"]
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