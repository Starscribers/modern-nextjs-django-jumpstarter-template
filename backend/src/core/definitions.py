from typing import TypedDict


class ErrorDict(TypedDict):
    code: int
    message: str


def error(code: int, message: str) -> ErrorDict:
    return {
        "code": code,
        "message": message,
    }


class ErrorCode:
    INVALID_PARAMETER = error(10001, "Invalid parameter")
    CONTENT_NOT_EXISTS = error(10002, "Content not exists")
    CONTENT_ALREADY_EXISTS = error(10003, "Content already exists")
    TOO_MANY_ATTEMPTS = error(10004, "Too many attempts")
    LOGIN_FAILED = error(10005, "Login failed")
    TOKEN_INVALID_OR_EXPIRED = error(10006, "Token is invalid or expired")
    CONTENT_NAME_ALREADY_EXISTS_IN_DEPARTMENT = error(
        10007,
        "The same name already exists in the department",
    )
    CAPTCHA_EXPIRED = error(10009, "Captcha is expired")
    CAPTCHA_INVALID = error(10010, "Captcha is invalid")
    DB_ERROR = error(10011, "Database error, please contact the administrator")
    SUBMIT_CHECK_FAILED = error(10012, "Submit check failed")
    EXCEEDED_MAXIMUM_RETRY_ATTEMPTS = error(10014, "Exceeded maximum retry attempts")
    CAMPAIGN_ASSOCIATED_WITH_USER = error(
        10015,
        "The campaign is associated with the user",
    )
