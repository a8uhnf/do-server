const Backbone = require('backbone');
const SignupFormView = require('../views/signup/signup-form-view');
const DashboardView = require('../views/home/dashboard-view');
const DoctorSectionView = require('../views/header/doctor-section-view');
const DoctorDetailsInfoView = require('../views/doctor/details-info-view');
const SidebarPatientView = require('../views/sidebar/patient-view');
module.exports = Backbone.Router.extend({
  constructor(options) {
    console.log('hello world', options);
    Backbone.Router.prototype.constructor.call(this, options);
  },
  routes: {
    '': 'homeDoctorSection',
    'register': 'registryUser',
    'doctor-infos': 'additionalDoctorInfos'
  },
  homeDoctorSection() {
    if (typeof this.headerView !== 'undefined') {
      this.headerView.close();
    }
    this.headerView = new DoctorSectionView();
    this.headerView.render();
    if (typeof this.sidebarView !== 'undefined') {
      this.sidebarView.close();
    }
    this.sidebarView = new SidebarPatientView();
    this.sidebarView.render();
  },
  registryUser() {
    console.log('register user');
    this.firstView = new SignupFormView();
    this.firstView.render();
  },
  dashboardRoute() {
    console.log('hello world, this is dashborad route');
    this.firstView = new DashboardView();
    this.firstView.render();
  },
  additionalDoctorInfos() {
    if (typeof this.sidebarView !== 'undefined') {
      this.sidebarView.close();
    }
    this.sidebarView = new SidebarPatientView();
    console.log('hello additional infos');
    if (typeof this.doctorDetailsInfoView !== 'undefined') {
      this.doctorDetailsInfoView.close();
    }
    this.doctorDetailsInfoView = new DoctorDetailsInfoView();
    this.doctorDetailsInfoView.render();
  }
});
