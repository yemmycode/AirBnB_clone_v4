#!/usr/bin/python3
""" Launches a Flask Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid

app = Flask(__name__)
# Uncomment to adjust Jinja2 templating settings
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Closes the SQLAlchemy session """
    storage.close()


@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ Renders the HBNB page """
    states = sorted(storage.all(State).values(), key=lambda k: k.name)
    st_ct = [[state, sorted(state.cities, key=lambda k: k.name)] for state in states]

    amenities = sorted(storage.all(Amenity).values(), key=lambda k: k.name)

    places = sorted(storage.all(Place).values(), key=lambda k: k.name)

    return render_template('0-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Application entry point """
    app.run(host='0.0.0.0', port=5001)
