import pyotp, os, random
from django.core.mail import send_mail
from twilio.rest import Client


def enable_2fa_authenticator(user_profile):
    user_profile.totp_secret = pyotp.random_base32()
    user_profile.save()
    return user_profile.totp_secret

def get_totp_uri(user_profile):
    totp = pyotp.TOTP(user_profile.totp_secret)
    return totp.provisioning_uri(user_profile.user.email, issuer_name="Pong_42")

def verify_twilio_otp(user_profile, submitted_code):
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        client = Client(account_sid, auth_token)
        verification_check = client.verify.v2.services(os.environ.get('TWILIO_SERVICE_SID')).verification_checks.create(
        to=user_profile.mobile_number,
        code=submitted_code
        )
        if verification_check.status == 'approved':
         return True
        else:
         return False

def send_otp(string, user_profile):
    if string == 'email':
        verification_code = "".join([str(random.randint(0, 9)) for i in range(6)])
        send_mail(
            'OTP',
            'Your OTP is ' + verification_code,
            os.environ.get('EMAIL_HOST_USER'),
            [user_profile.user.email],
            fail_silently=False,
        )
        return verification_code
    elif string == 'sms':
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        service_sid = os.environ.get('TWILIO_SERVICE_SID')
        client = Client(account_sid, auth_token)

        verification = client.verify.services(service_sid).verifications.create(
            to=user_profile.mobile_number,
            channel='sms'
        )
        return verification.sid
    elif string == 'application':
        return '0'