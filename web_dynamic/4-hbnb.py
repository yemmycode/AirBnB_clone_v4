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
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db_session(error):
    """ Closes the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb/', strict_slashes=False)
def hbnb_view():
    """ Displays the HBNB page """
    states_list = storage.all(State).values()
    sorted_states = sorted(states_list, key=lambda x: x.name)
    state_city_list = []

    for state in sorted_states:
        state_city_list.append([state, sorted(state.cities, key=lambda x: x.name)])

    amenities_list = storage.all(Amenity).values()
    sorted_amenities = sorted(amenities_list, key=lambda x: x.name)

    places_list = storage.all(Place).values()
    sorted_places = sorted(places_list, key=lambda x: x.name)

    return render_template(
        '0-hbnb.html',
        states=state_city_list,
        amenities=sorted_amenities,
        places=sorted_places,
        cache_id=uuid.uuid4()
    )


if __name__ == "__main__":
    """ Entry point for the application """
    app.run(host='0.0.0.0', port=5001)
