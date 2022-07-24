# Feedback App Backend

## Modules

- [x] Authentication
- [x] Users
- [x] Suggestions
- [x] Votes
- [x] Comments (replies)

## Nomenclature

- `XYZRequestDTO`: Parameters that service functions receive
- `XYZBodyDTO`: Expected shape of body http requests. Usually these classes extends from the main XYZRequestDTO but omitting/adding some types
- `XYZQueryParamsDTO`: Expected shape of parsed http query params
- `XYZResponseDTO`: Return type from the service functions
- `XYZParamsDTO`: Expected shape of parsed http URL parameters
