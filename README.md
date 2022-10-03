# lastminute.jobs
Matching employees and employers in last minute needs.

Back-end API for a website called lastminute.jobs to connect employees with employers.

### Employer
For employers: You need an extra last minute help on your business? Find help on lastminute.jobs

### Employee
For employees: You want an extra cash and you are available next weekend? Find a job on lastminute.jobs

The platform allows for employes to post their jobs, and employees to apply for jobs on lastminute.

#### Categories of jobs suported
- Restaurants: kitchen, serving, cleanning;
- Bars: serving, cleanning, security;
- Clubs: serving, cleanning, security;;
- Stores: selling, cleaning, organization;


#### Database MongoDB
##### Table Users
    -id;
    -name;
    -email;
    -type;
    -description;
    -createdat;
    -lastlogin;
    -location;
    -status;
    -comments;
    -rating;
##### Table jobs
    -id;
    -employerId;
    -description;
    -post_date;
    -execution_date;
    -hourly_rate;
    -n_hours;
    -n_applications;
    -category;
##### Application
    -employeeId;
    -employeerId;
    -jobId;
    -dateSubmittion;
    -status;


### Endpoints

- create/auth account as employer; 
- create/auth account as employee;
(Different actions, endpoints, if you are an employeer or an employee);
- list jobs;
    filter by category
    sort by closest one;
    sort by time posted;
    sort by rating;
- get employeer description;
- get employee description;

- employer: create/update profile
- employer: post/update/get/delete a job;
- employer: list posted jobs
- employer: list applications for a job
- employer: get/update:accept/reject an application;
- employeer: post employee comment, rating;

- employee: create/update profile;
- employee: create/get/update/delete an application;
- employee: post employeer comment, rating;
- employee: list applications;





