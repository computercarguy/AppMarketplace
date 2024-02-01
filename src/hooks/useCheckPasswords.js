export default function useCheckPasswords(password1, password2, options) {
    let results = {
        minLength: options.minLength && password1.length >= options.minLength,
        hasUpperCase: options.hasUpperCase && /[A-Z]/.test(password1),
        hasLowerCase: options.hasLowerCase && /[a-z]/.test(password1),
        hasNumbers: options.hasNumbers && /\d/.test(password1),
        hasNonalphas: options.hasNonalphas && /\W/.test(password1),
        match: password1 && password1 === password2,
        valid: true
    };

    for (var key in results) {
        if (results.hasOwnProperty(key)) {
            results["valid"] &= results[key];
        }
    }

    return results;
}
