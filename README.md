# DeadSimpleTorrent
Connect your Transmission Web UI to a minimalistic, efficient download menu powered by RARBG

![DeadSimpleTorrent Demo](https://geoge.ml/imgs/dst-example.gif)

### Configuration
Setup is, as expected, dead simple. The reccommended way to run this program is with Docker. Just run
```
docker run -d --name=dst -e TRANSMISSION_USERNAME=username -e TRANSMISSION_PASSWORD=password -e TRANSMISSION_URL=url geoge23/dead-simple-torrent 
```
Make sure to fill in the environment variables with your Transmission information. The program has only been tested with and expects basic auth when
connecting to transmission. Especially if it is open to the internet, you should consider adding basic auth using software like NGINX

### Why not use sonarr/radarr?
This program is intended to fill in the gaps where you may want to download only a few episodes of a show or a specific movie.
