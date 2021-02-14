import React, { Component } from "react";
import BasicView from "./user/BasicView";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserSignUp from "./auth/UserSignUp";
import SignIn from "./auth/SignIn";
import HomePage from "./user/HomePage";
import Staff from "./user/Staff";
import ContactsPage from "./user/ContactsPage";
import CoachBasicView from "./user/CoachBasicView";
import AdminHomepage from "./admin/AdminHomepage";
import Details from "./user/Details";
import ChatListPage from "./chat/ChatListPage";
import ChatPage from "./chat/ChatPage";
import SelectList from "./chat/SelectList";
import Tracker from "./map/Tracking";
import MapLeaflet from "./map/MapLeaflet";
import CoachProfile from "./user/CoachProfile";
import UserProfile from "./user/UserProfile";
import PlansDetails from "./user/PlansDetails";
import LessonPage from "./lessons/LessonPage";
import UserCourses from "./user/UserCourses";
import Lessons from "./user/Lessons";
import PageNotFound from "./PageNotFound";
import ArchiveWorkout from "./map/ArchiveWorkout";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signup" component={UserSignUp} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/view" component={BasicView} />
          <Route exact path="/staff" component={Staff} />
          <Route exact path="/contacts" component={ContactsPage} />
          <Route exact path="/coaches" component={CoachBasicView} />
          <Route exact path="/admin" component={AdminHomepage} />
          <Route exact path="/details" component={Details} />
          <Route exact path="/chatList" component={ChatListPage} />
          <Route exact path="/chat" component={ChatPage} />
          <Route exact path="/selectList" component={SelectList} />
          <Route exact path="/map" component={MapLeaflet} />
          <Route exact path="/archive" component={ArchiveWorkout} />
          <Route exact path="/tracker" component={Tracker} />
          <Route exact path="/cprofile" component={CoachProfile} />
          <Route exact path="/uprofile" component={UserProfile} />
          <Route exact path="/plansDetails" component={PlansDetails} />
          <Route exact path="/lessons" component={LessonPage} />
          <Route exact path="/courses" component={UserCourses} />
          <Route exact path="/homepagelessons" component={Lessons} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
