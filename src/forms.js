import React, { Component } from 'react';
import css from './forms.module.css';
import NumericInput from 'react-numeric-input';

class BedForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isCreated: false,
            name:"",
            address:"",
            totalBedCount:0,
            occupidBedCount:0
        }

    }

    activate_session = (e) => {
        e.preventDefault();
        this.setState(() => {return {isCreated:true}});
    };

    onUpdateParts = (e) => {
        console.log(e)
    };

    facName = (e) => {
        this.setState({name: e.target.value});
    };
    facLoc = (e) => {
        this.setState({address: e.target.value});
    };
    facNumBed = (e) => {
        this.setState({totalBedCount: e.target.value});
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
                        <NumericInput type="number" className="form-control" min={0} max={this.state.totalBedCount} value={0} onChange={this.onUpdateParts.bind(this)}/>
                    </div>
                </div>
            </form>
          </div>
        );
    }
}

export default BedForm;