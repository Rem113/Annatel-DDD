# Auth context

## Account

### Fields

- Email
- Password

### Commands

- Register(Email, Password)
- Login(Email, Password)

### Queries

- WithEmail(Email) -> Account

# Watch context

## Watch

### Fields

- SerialNumber
- Messages

### Commands

- PostMessage(Message)

### Queries

- ReadMessagesOf(Watch) -> Messages
- GetLocationOf(Watch) -> Location

## Parent

### Fields

- Account
- Watches
  - Geofences

### Commands

- SubscribeTo(Watch)
- UnsubscribeFrom(Watch)
- DefineGeofenceFor(Watch)

### Queries

- GetGeofencesFor(Watch) -> Geofences
- GetLinkedWatch() -> Watches
