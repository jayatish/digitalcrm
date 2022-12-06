'use strict';

module.exports = {
    errors: {
        INTERNAL_ERROR: {
            message: "Internal Server Error",
            code: 500
        },
        DATABASE_ERROR: {
            message: "We have found some database errors in servers",
            code: 500
        },
        NO_API_FOUND: {
            message: "This Api Is Not Implemented Till Now",
            code: 404
        },
        UNAUTHORIZED_TOKEN: {
            message: "Token is invalid",
            code: 403
        },
        NO_DATA_FOUND: {
            message: "No Data Found!!",
            code: 402
        },
        PASSWORD_MISMATCH: {
            message: "Password is incorrect",
            code: 402
        },
        USER_NOT_FOUND: {
            message: "Requested user not registered",
            code: 402
        },
        LOGIN_ERROR: {
            message: "Invalid Credentials",
            code: 402
        },
        EMAIL_REQUIRED: {
            message: "Email is missing in the request",
            code: 401
        },
        SIGNUP_ERROR: {
            message: "Signup Error",
            code: 401
        },
        ValidationError: {
            message: "Validation Error",
            code: 401
        },
        USER_ALREADY_EXIST: {
            message: "User already exists",
            code: 400
        },
        USER_DOES_NOT_EXIST: {
            message: "User does not exist",
            code: 400
        },
        ROLE_ALREADY_EXIST: {
            message: "Role already exist",
            code: 400
        },
        ROLE_DOES_NOT_EXIST: {
            message: "Role does not esist",
            code: 400
        },
        TYPE_ALREADY_EXIST: {
            message: "Type already exist",
            code: 400
        },
        TYPE_DOES_NOT_EXIST: {
            message: "Type does not exist",
            code: 400
        },
        HOTEL_DESCRIPTION_EXIST: {
            message: "Description exist for this hotel for this particular language",
            code: 400
        },
        HOTEL_DESCRIPTION_DOES_NOT_EXIST: {
            message: "Missing entry for particular hotel and language",
            code: 400
        },
        HOMESTAY_DESCRIPTION_EXIST: {
            message: "Description exist for this homestay for this particular language",
            code: 400
        },
        HOMESTAY_DESCRIPTION_DOES_NOT_EXIST: {
            message: "Missing entry for particular homestay and language",
            code: 400
        },
        LANGUAGE_ALREADY_EXIST: {
            message: "Language already exist",
            code: 400
        },
        LANGUAGE_DOES_NOT_EXIST: {
            message: "Language does not exist",
            code: 400
        },
        HOTEL_ALREADY_REGISTERED: {
            message: "Hotel name is already registered by the owner",
            code: 400
        },
        HOTEL_NOT_REGISTERED: {
            message: "Hotel not registered",
            code: 400
        },
        HOMESTAY_ALREADY_REGISTERED: {
            message: "Homestay name is already registered by the owner",
            code: 400
        },
        HOMESTAY_NOT_REGISTERED: {
            message: "Homestay not registered",
            code: 400
        },
        PASSWORD_REQUIRED: {
            message: "Password required",
            code: 400
        },
        LIST_IS_EMPTY: {
            message: "List does not have any value",
            code: 400
        },
        CONTACT_DOES_NOT_EXIST: {
            message: "Contact information not present",
            code: 400
        },
        CONTACT_ALREADY_EXIST: {
            message: "Contact already present",
            code: 400
        },
        SUBSCRIPTION_EXISTS: {
            message: "Email already subscribed",
            code: 400
        },
        SUBSCRIPTION_DOES_NOT_EXISTS: {
            message: "Email not subscribed",
            code: 400
        },
        TYPE_ALREADY_EXIST: {
            message: "Type already exist",
            code: 400
        },
        TYPE_DOES_NOT_EXIST: {
            message: "Type does not exist",
            code: 400
        },
        VEHICLE_DOES_NOT_EXIST: {
            message: "Vehicle does not exist",
            code: 400
        },
        VEHICLE_ALREADY_REGISTERED: {
            message: "Vehicle already registered by another user",
            code: 400
        },
        VEHICLE_NOT_REGISTERED: {
            message: "Vehicle not registered",
            code: 400
        },
        VEHICLE_DESCRIPTION_EXIST: {
            message: "Vehicle description exist",
            code: 400
        },
        VEHICLE_DESCRIPTION_DOES_NOT_EXIST: {
            message: "Vehicle description does not exist",
            code: 400
        },
        VEHICLE_FACILITY_EXIST: {
            message: "Vehicle facility exist",
            code: 400
        },
        ZONE_DOES_NOT_EXIST: {
            message: "Zone does not exist",
            code: 400
        },
        INVALID_LOGIN: {
            message: "Invalid username or password",
            code: 400
        },
        INVALID_TOKEN: {
            message: "Invalid token authorization",
            code: 400
        },
        BANNER_ALREADY_EXIST: {
            message: "Banner already exist for this language",
            code: 400
        },
        BANNER_DOES_NOT_EXIST: {
            message: "Banner does not exist",
            code: 400
        },
        REGION_DOES_NOT_EXIST: {
            message: "Region does not exist",
            code: 400
        },
        REGION_ALREADY_EXIST: {
            message: "Region already existing",
            code: 400
        },
        EQUIPMENT_NOT_REGISTERED: {
            message: "Equipment is not registered",
            code: 400
        },
        EQUIPMENT_ALREADY_REGISTERED: {
            message: "Equipment already registered",
            code: 400
        },
        EQUIPMENT_DESCRIPTION_EXIST: {
            message: "Equipment description already present",
            code: 400
        },
        EQUIPMENT_DESCRIPTION_DOES_NOT_EXIST: {
            message: "Equipment description does not exist",
            code: 400
        },
        FAQ_DOES_NOT_EXIST: {
            message: "No FAQ available",
            code: 400
        },
        BENEFIT_DOES_NOT_EXIST: {
            message: "No Benefit available",
            code: 400
        },
        USER_NOT_ACTIVATED: {
            message: "Account still not activated. Please click on the link send to your registered email to activate your account.",
            code: 400
        }
    },
    success: {
        SUCCESS: {
            message: "success",
            code: 200
        },
        SUCCESSFUL_SIGNUP: {
            message: "Sign Up Successful. Verification mail is sent to your email.",
            code: 201
        },
        LOGIN_SUCCESSFUL: {
            message: "Login Successful",
            code: 200
        },
        SERVER_RUNNING: {
            message: "Server is configured properly",
            code: 200
        },
        CUSTOM_MESSAGE: {
            message: "Please include a message for this response",
            code: 200
        },
        USER_FOUND: {
            message: "We have found the user",
            code: 200
        },
        UPDATE_SUCCESSFUL: {
            message: "Update Successful",
            code: 200
        },
        USER_NOT_FOUND: {
            message: "Requested user not found",
            code: 200
        }
    }
}