from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis_result = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Analysis for {self.user.username} at {self.timestamp}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, unique=True)
    is_phone_verified = models.BooleanField(default=False)

class ChatLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    date_created = models.DateField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"ChatLog {self.user} - {self.date_created}"
    
class Message(models.Model):
    chat = models.ForeignKey(ChatLog, on_delete=models.CASCADE, default=1)
    from_user = models.BooleanField(default=True)
    message_content = models.CharField(max_length=256)
    date_created = models.DateField(auto_now_add=True)
    def __str__(self):
        return self.message_content
    
class CounselingAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career_counseling = models.FloatField()
    social_support_counseling = models.FloatField()
    general_counseling = models.FloatField()
    bullying_intervention_counseling = models.FloatField()
    extracurricular_engagement_counseling = models.FloatField()
    health_and_wellness_counseling = models.FloatField()
    school_counseling = models.FloatField()
    academic_achievement_counseling = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Counseling Analysis for {self.user.username}"