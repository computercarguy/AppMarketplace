import React from "react";

export default function PasswordValidation(params) {
    return (
        <div
            className={
                "row alignright" +
                (!params.PasswordsValidation["valid"]
                    ? " visible redWarning"
                    : " hidden")
            }
        >
            Passwords must meet the following <br /> requirements:
            <ul>
                {!params.PasswordsValidation["minLength"] && (
                    <li>Have at least {params.MinLength} characters</li>
                )}

                {!params.PasswordsValidation["hasUpperCase"] && (
                    <li>Have at least one upper case letter</li>
                )}

                {!params.PasswordsValidation["hasLowerCase"] && (
                    <li>Have at least one lower case letter</li>
                )}

                {!params.PasswordsValidation["hasNumbers"] && (
                    <li>Have at least one number</li>
                )}

                {!params.PasswordsValidation["hasNonalphas"] && (
                    <li>
                        Have at least one special character, <br /> example:
                        !@#$%^&*()
                    </li>
                )}

                {!params.PasswordsValidation["match"] && (
                    <li>Both passwords must match</li>
                )}
            </ul>
        </div>
    );
}
