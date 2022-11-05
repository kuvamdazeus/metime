## MeTime 🎶

### Overview Video
[![MeTime Youtube Demo Video](https://img.youtube.com/vi/0Fw4VJj3EtI/0.jpg)](https://www.youtube.com/watch?v=0Fw4VJj3EtI)

### Description
A spotify-themed web app made with NextJS & SpotifyAPI, Functionally, it is almost similar spotify except for the song suggestions which are suggested using ML (Nearest Neighbors Classifier). Which means that The songs in the "Made for ..." section of the dashboard is generated & stored not by spotify, but by the app itself.
Technologies used: NextJS, Recoil (state management), Supabase (stores user data) & MongoDB (stores the prepared spotify songs dataset).

### How ML is being used?
I trained an ML model with SKLearn's KMeans clustering model on a spotify dataset downloaded from kaggle & divided it into 5 clusters according to the tracks' energy, instrumentalness, acousticness, etc. and stored the clustered dataset in a mongodb database.

Then, I fetch user's most loved tracks from spotify api when they login, find out the what cluster numbers are most prevalent in their loved tracks by comparing it to the dataset and then return shuffled tracks of their most loved cluster number from the previously stored mongodb spotify dataset.
