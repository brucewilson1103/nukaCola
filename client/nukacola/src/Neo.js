import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Neo extends Component {
  render() {
    return (
      <div>
                      <div className="jumbotron jumbotron-fluid bg-info text-light">
                    <div className="container-fluid">
                      <h2>Potentially Hazardous Near Earth Asteroids</h2>
                    </div>
                    
                  </div>
                
                  <div className="container-fluid">
                  <div className="row">
                    <div className="col-4">
                      <h4><a id="neo-link" href="#" target="_blank">Click an NEO to see title</a></h4>
                      <form>
                        <h5>Leave a note</h5>
                        <input type="text" className="form-control" id="note-title"/>>
                        <textarea name="note" id="note-body" className="form-control" cols="30" rows="10"></textarea>
                        <button className="btn btn-block btn-success" id="submit-note">Submit Note</button>
                      </form>
                    </div>
                    <div className="col-8">
                      <h4>View Near Earth Objects (Potentially Hazardous Asteroids)</h4>
                      <ul className="list-group" id="neos">
                
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/js/bootstrap.min.js"></script>
                <script src="assets/js/script.js"></script> */}
      </div>
    );
  }
}

export default Neo;
