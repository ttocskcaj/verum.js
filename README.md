# verum.js form validator
## About
verum.js is a jQuery plugin to validate HTML forms in a simple, fluent way.

## Useage
1. Select the form that you want to validate
2. Pass through the array rules {inputName:rules} to use for validation
3. verum.js will add the pass class to all inputs that pass and the fail class to all inputs that fail.
```
$("#myForm").verum({
    'rules': {
        'first_name': 'required|min:4|max:60|name',
        'last_name': 'required|min:4|max:60|name',
        'username': 'required|username',
        'email': 'required|email',
        'cell': 'cellphone',
        'password': 'password|min:6',
        'password_confirmation': 'matches:password'
     }
});
``` 

## Validation Rules
 - min:x            - The input MUST contain at least x characters.
 - max:x            - The input cannot contain more than x characters.
 - required         - The input can't be blank.
 - name             - Must be A-Z, a-z, 0-9, space, or apostrophe.
 - username         - Must be A-Z, a-z, 0-9, or underscore.
 - email            - Must be a valid email address.
 - cellphone        - Must be a valid NZ cellphone number.
 - matches:input    - Must be the same as the specified input.