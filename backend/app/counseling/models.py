from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import json

class CallRecord(models.Model):
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    SENTIMENT_CHOICES = [
        ('neutral', 'Neutral'),
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    
    # Link to Django's default User model
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='call_records')
    
    # Basic call information
    date = models.DateField()
    time = models.TimeField()
    duration = models.DurationField()
    recording_url = models.CharField()
    summary = models.TextField()
    
    # Analysis fields
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES)
    mood = models.JSONField()  # Store as JSON array
    key_phrases = models.JSONField()  # Store as JSON array
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)
    follow_up_needed = models.BooleanField(default=False)
    
    # Meta information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Call with {self.user.username} on {self.date} at {self.time}"
    
    def set_mood(self, mood_list):
        self.mood = json.dumps(mood_list)
        
    def get_mood(self):
        return json.loads(self.mood)
    
    def set_key_phrases(self, phrases_list):
        self.key_phrases = json.dumps(phrases_list)
        
    def get_key_phrases(self):
        return json.loads(self.key_phrases)


# Alternative implementation using PostgreSQL ArrayField
# Requires Django's PostgreSQL extensions
class CallRecordWithArrays(models.Model):
    RISK_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    SENTIMENT_CHOICES = [
        ('neutral', 'Neutral'),
        ('mild', 'Mild'),
        ('moderate', 'Moderate'),
        ('severe', 'Severe'),
    ]
    
    # Link to Django's default User model
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='call_records_array')
    
    # Basic call information
    date = models.DateField()
    time = models.TimeField()
    duration = models.DurationField()
    recording_url = models.URLField()
    summary = models.TextField()
    
    # Analysis fields with PostgreSQL ArrayField
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES)
    mood = ArrayField(models.CharField(max_length=50))
    key_phrases = ArrayField(models.CharField(max_length=100))
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)
    follow_up_needed = models.BooleanField(default=False)
    
    # Meta information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Call with {self.user.username} on {self.date} at {self.time}"


# Create your models here.
class Diary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="diary_entries")
    text = models.TextField()
    type = models.CharField(max_length=50, default="heart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diary Entry by {self.user.username} on {self.created_at.strftime('%Y-%m-%d')}"
        
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
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    
    # New Fields
    gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        null=True, blank=True,
        default=""
    )
    age = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True, default="")  # Location can be a city, country, etc.

    def __str__(self):
        return f"Profile of {self.user.username}"
    
    def save(self, *args, **kwargs):
        if self.phone_number == "":
            self.phone_number = None
        super().save(*args, **kwargs)

class ChatLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    date_created = models.DateField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    summary = models.TextField(null=True, blank=True)  
    analysis = models.JSONField(null=True, blank=True)
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

class BreathingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BreathingSession {self.user.username} - {self.timestamp}"

class SleepEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    sleep_time = models.CharField(max_length=10)
    wake_time = models.CharField(max_length=10)
    duration = models.CharField(max_length=10)

    def __str__(self):
        return f"SleepEntry {self.user.username} - {self.date}"

class MoodEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50)
    reason = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood} ({self.timestamp})"

