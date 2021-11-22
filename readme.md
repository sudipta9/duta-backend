# API routers

| Router                  | use                                    | required body                                                                                | Required Header   |
| ----------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------- |
| /api/user/sign-up       | to sign up an user                     | <ul><li>userName (r)</li><li>mobileNumber (r)</li><li>name (r)</li><li>password (r)</li><ul> | none              |
| /api/user/sign-in       | to sign in an user                     | <ul><li>mobileNumber (r)</li><li>password (r)</li></ul>                                      | none              |
| /api/user/find          | to find a user                         | userName (r)                                                                                 | authorization (r) |
| /api/chat/send          | to send message to someone             | <ul><li>receiverId (r)</li><li>message (r)</li></ul>                                         | authorization (r) |
| /api/chat/get-all       | to fetch whole inbox                   | none                                                                                         | authorization (r) |
| /api/chat/get-user-chat | to get all messages from a single user | otherPersonId (r)                                                                            | authorization (r) |
