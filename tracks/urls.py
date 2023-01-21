from django.urls import path

from . import views

urlpatterns = [
    path("index", views.index, name = 'index'),
    path("", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("search/<str:artist>", views.search_artist, name = "search_artist"),
    path("related/<str:artist>", views.related_artist, name = "related_artist"),
    path("artist/<str:name>/<str:artist>/tracks", views.artist_track, name = "artist_track"),
    path("create/playlist/<str:title>/<str:desc>", views.create_playlist, name = 'create_playlist'),
    path("create/playlist/add/track/<str:userid>/<str:playid>/<str:track>", views.playlist_add_track, name = "playlist_add_track"),
]