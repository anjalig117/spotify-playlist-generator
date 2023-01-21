from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util

cid = os.getenv('CLIENT_ID')
secret = os.getenv('CLIENT_SECRET')
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_secret=secret, client_id=cid, scope='playlist-modify-public', redirect_uri='https://www.google.com/', show_dialog=True))

from .models import User

track = []

# Create your views here.
def index(request):
    return render(request, 'tracks/index1.html')
    #return HttpResponse(':)')

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "tracks/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "tracks/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "tracks/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "tracks/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "tracks/index.html")

def search_artist(request, artist):

    images = []
    artist_name = sp.search(q=artist, type = 'artist')

    for image in artist_name['artists']['items']:
        if(len(image['images']) == 0):
            images.append('')
        else:
            images.append(image['images'][0])

    if artist_name['artists']['items'][0]['uri']:
        spotify_uri = artist_name['artists']['items'][0]['uri']
    else:
        spotify_uri = artist_name['artists']['items'][1]['uri']
    
    return JsonResponse({"images": images[0], "name": artist, "uri": spotify_uri}, safe=False)


def related_artist(request, artist):

    related = []
    result = sp.artist_related_artists(artist)

    for relatede in result['artists'][:10]:
        related.append(relatede['name'])
    
    print(related)
    return JsonResponse(related, safe=False)


def artist_track(request, name, artist):
    result = sp.artist_top_tracks(artist)

    for tracke in result['tracks'][:10]:
        milliseconds = tracke['duration_ms']
        minutes = (milliseconds/(1000 * 60)) % 60
        #minutes = f'{round(minutes, 2)}'
        minutes = round(minutes, 2)
        hours, seconds = divmod(minutes * 60, 3600)
        minute, seconds = divmod(seconds, 60)
        results = "{:02.0f}:{:02.0f}".format(minute, seconds)
        track.append([tracke['name'], tracke['artists'][0]['name'], tracke['album']['name'], results, tracke['external_urls']['spotify'], tracke['uri']])
    
    results = [list(x) for x in set(tuple(x) for x in track)]

    a = random.sample(results, len(results))
    tracks = random.sample(a, 10)
    return JsonResponse(tracks, safe=False)
    #return HttpResponse(':)')

def create_playlist(request, title, desc):

    user = sp.current_user()
    ids = user['id']
    print(f'user id {ids}')
   
    create = sp.user_playlist_create(user=ids, name=title, public=True, collaborative=False, description=desc)

    id = create['id']
    print(f'playlist id {id}')

    return JsonResponse({"user_id": ids, "playlist_id": id}, safe=False)

def playlist_add_track(request, userid, playid, track):

    tracks = sp.user_playlist_add_tracks(user=userid, playlist_id=playid, tracks={track}, position=None)

    return JsonResponse(tracks, safe=False)