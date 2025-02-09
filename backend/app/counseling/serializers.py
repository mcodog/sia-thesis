# import serializer from rest_framework
from rest_framework import serializers

# import model from models.py
from .models import ChatLog, Message
from django.contrib.auth.models import User

# Create a model serializer
class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'first_name', 'last_name', 'password'] 

    def create(self, validated_data):
        password = validated_data.pop('password') 
        user = User(**validated_data) 
        user.set_password(password)
        user.save()
        return user

class ChatLogSerializer(serializers.HyperlinkedModelSerializer):
	user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
	class Meta:
		model = ChatLog
		fields = ('id','user', 'date_created', 'last_updated')

class MessageSerializer(serializers.HyperlinkedModelSerializer):
	chat = serializers.PrimaryKeyRelatedField(queryset=ChatLog.objects.all())
	class Meta:
		model = Message
		fields = ('id','chat', 'from_user', 'message_content', 'date_created')