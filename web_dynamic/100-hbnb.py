#!/usr/bin/python3
""" Starts a Flask Web Application """
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
def teardown_db(exception):
    """ Closes the current SQLAlchemy Session """
    storage.close()


@app.route('/100-hbnb/', strict_slashes=False)
def display_hbnb():
    """ Displays the HBNB page """
    states = sorted(storage.all(State).values(), key=lambda state: state.name)
    states_cities = [[state, sorted(state.cities, key=lambda city: city.name)] for state in states]

    amenities = sorted(storage.all(Amenity).values(), key=lambda amenity: amenity.name)

    places = sorted(storage.all(Place).values(), key=lambda place: place.name)

    return render_template('0-hbnb.html',
                           states=states_cities,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main entry point """
    app.run(host='0.0.0.0', port=5001)

