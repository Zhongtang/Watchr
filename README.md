# Watchr

Monitor stock quote prizes and send push notifications

# Ongoing

Prototyping. Plan is to poll [IEX API](https://iextrading.com/developer/docs/#stocks) for stock prizes and use [Pushover](https://pushover.net/clients) (free for 7 days) for push notifications

- [x] Basic web framework
- [ ] Poll IEX
- [ ] Send push notifications
- [ ] Hosting
- [ ] Persist data

# Setup

## View Swagger UI
1. Setup local swagger UI following https://swagger.io/docs/swagger-tools/#download-33
2. Setup local static http file server
```
npm install -g http-server
cd <LOCAL REPO>
http-server --cors --port 8080
```
3. Go back to swagger UI, paste `http://localhost:8080/swagger.yaml` and click `Explore`
