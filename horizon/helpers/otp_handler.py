
from opentotp import OpenTOTP
from uuid import uuid4

# otp_method = OpenTOTP(secret=uuid4().hex,
#                alphabet="0123456789",
#                otp_length=6,
#                otp_change_interval=5,
#                otp_drift=10)

otp_method = OpenTOTP(secret=uuid4().hex,
               alphabet="0123456789",
               otp_length=6,
               otp_change_interval=60,
               otp_drift=40)


class OTPHandler():
    
    def generate():
        otp_value = otp_method.generate()
        return otp_value
    

    def verify(otp : str):
        if otp_method.verify(otp):
            return True
        return False
