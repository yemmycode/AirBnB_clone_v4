#!/usr/bin/python3
""" Initializes a Flask Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid

app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True

@app.teardown_appcontext
def close_db(error):
    """ Closes the current SQLAlchemy session """
    storage.close()

@app.route('/3-hbnb/', strict_slashes=False)
def hbnb():
    """ Renders the HBNB page """
    states = list(storage.all(State).values())
    states.sort(key=lambda k: k.name)
    st_ct = []

    for state in states:
        sorted_cities = sorted(state.cities, key=lambda k: k.name)
        st_ct.append([state, sorted_cities])

    amenities = list(storage.all(Amenity).values())
    amenities.sort(key=lambda k: k.name)

    places = list(storage.all(Place).values())
    places.sort(key=lambda k: k.name)

    return render_template('0-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())

if __name__ == "__main__":
    """ Runs the application """
    app.run(host='0.0.0.0', port=5001)
