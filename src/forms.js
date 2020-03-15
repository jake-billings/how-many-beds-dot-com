import React, { Component } from 'react';
import css from './forms.module.css';


class BedForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isCreated: false,
            facilityName:"",
            facilityLocation:"",
            facilityBedCount:0,
            numCurBed:0
        }

    }

    activate_session = (e) => {
        e.preventDefault();
        this.setState(() => {return {isCreated:true}});
    };

    onUpdateParts = (e) => {
        e.preventDefault();
        // e.target.value -- to get value updated
    };

    facName = (e) => {
        this.setState({facilityName: e.target.value});
    };
    facLoc = (e) => {
        this.setState({facilityLocation: e.target.value});
    };
    facNumBed = (e) => {
        this.setState({facilityBedCount: e.target.value});
    };


    render() {
        return (
          <div className={css.formContainer}>
            <form>
                <div className="form-row my-2">
                    <div className="col-5">
                        <label>Name of facility</label>
                        <input type="text" className="form-control" placeholder="Medical facilities name" disabled={this.state.isCreated}
                               onChange={this.facName.bind(this)}
                        />
                    </div>
                    <div className="col-5">
                        <label>Medical facilities location</label>
                        <input type="text" className="form-control" placeholder="Location" disabled={this.state.isCreated}
                               onChange={this.facLoc.bind(this)}/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-2">
                        <label> number of beds </label>
                        <input type="number" className="form-control" placeholder="number of beds" disabled={this.state.isCreated}
                               onChange={this.facNumBed.bind(this)}/>
                    </div>
                    <div className="col-1" hidden={this.state.isCreated}>
                        <button className="btn btn-primary" onClick={this.activate_session.bind(this)}>Start session</button>
                    </div>
                    <div className="col-3" hidden={!this.state.isCreated}>
                        <label>How many filled</label>
                        <input type="number" className="form-control" placeholder="number of full beds" onChange={this.onUpdateParts.bind(this)}/>
                    </div>
                </div>
            </form>
          </div>
        );
    }
}

export default BedForm;