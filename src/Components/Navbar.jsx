import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout, getForms, reloaded} from '../Actions/actions'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import socketIO from 'socket.io-client'

let socket = socketIO('https://officebackend.herokuapp.com')


export class Navbar extends Component {
    state ={
        notifications: 0
    }
    
    componentDidMount() {
        this.props.getForms(this.props.user.departmentNo)
        socket.on('Form Created', result => {
            this.props.getForms(this.props.user.departmentNo)
            let pendingActions = this.props.forms.filter((e, i) => {
                return e.createdTo === this.props.user.email && e.isActedOn === false
            })
            this.setState({
                notifications: pendingActions.length
            })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.props.forms !== prevProps.forms){
            let pendingActions = this.props.forms.filter((e, i) => {
                return e.createdTo === this.props.user.email && e.isActedOn === false
            })
            this.setState({
                notifications: pendingActions.length
            })
        }
         
    }
    render() {

        return (
            <nav className="navbar nav-dark text-light bg-dark">
                {
                    this.props.user.email === undefined
                        ? <Redirect to="/" />
                        : ""
                }
                <div>
                    <Link to={`form`}><span className="nav-item col-3 text-light">Form</span></Link>
                    <Link to={`pending`}><span className="nav-item col-3 text-light">Pending</span></Link>
                    <Link to={`completed`}><span className="nav-item col-3 text-light">Completed</span></Link>
                    <Link to={`sentrequest`}><span className="nav-item col-3 text-light">Requested</span></Link>
                </div>
                <div>
                    <span className="nav-item col-3"><i className="fa fa-bell" aria-hidden="true"></i>
                        {this.state.notifications > 0
                            ? <span className="badge badge-pill badge-primary">{this.state.notifications}</span>
                            : ""
                        }

                    </span>
                    <a href="" className="nav-item col-3 text-light" onClick={() => this.props.logout()}>Logout</a>
                </div>
            </nav>

        )
    }
}

const mapStateToProps = (state) => {
    const { user, forms, reload } = state
    return { user, forms , reload}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout, getForms, reloaded}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
