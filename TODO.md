TODO and LLM Suggestions (copied from README)

TODO

- [x] Build models for the applications
- [x] Configure the database to run on Docker
- [ ] Publish the application on Microsoft Azure
- [ ] Implement confirmation pop dialog box using SweetAlerts (MVC/SweetAlert-style popup)
- [ ] Implement a home page view in the style of the IEC website
- [ ] Implement the statistics view on Voter registration. See reference
- [x] Implement the Identity Framework for authorization and authentication
- [ ] Implement the results dashboard view using Highcharts

LLMs Suggestions

Critical Security & Data Integrity
- [ ] Implement audit logging - Track all voting actions (who voted when, IP addresses, failed attempts) for transparency and fraud detection
- [ ] Add vote timestamp - Store when each vote was cast in the Vote model
- [ ] Prevent duplicate votes at DB level - Add unique constraint on ApplicationUserId in Votes table
- [ ] Implement rate limiting - Prevent brute force attacks on registration/login endpoints
- [ ] Add CSRF token validation - Ensure VoteResult POST action has proper anti-forgery tokens
- [ ] Validate ID number authenticity - Implement South African ID number validation algorithm (checksum digit validation)
- [ ] Add email confirmation enforcement - Currently RequireConfirmedAccount is true but needs proper flow
- [ ] Implement voting period restrictions - Add election start/end dates; prevent voting outside these periods

Core Functionality Enhancements
- [ ] Add voting confirmation page - Show user their selection before final submission (prevent accidental votes)
- [ ] Implement "already voted" check - Redirect users who already voted to a status page instead of voting page
- [ ] Add party details page - Allow users to view party manifestos/information before voting
- [ ] Create admin dashboard - Manage parties, view real-time vote counts, manage election periods
- [ ] Implement voter eligibility checks - Verify age from ID number (must be 18+), check registration deadlines
- [ ] Add province-based voting - Track which province users vote from (you have Address model but it's not used)
- [ ] Create API endpoints - Allow the "cei" site to fetch live statistics from "vote" database
- [ ] Implement results calculation service - Calculate percentages, winning parties, turnout rates
- [ ] Add voter registration statistics - Track registrations by province, age group, date

User Experience Improvements
- [ ] Add loading states - Show spinners during vote submission
- [ ] Implement success/error notifications - Use toast notifications or SweetAlert2 for feedback
- [ ] Create voter dashboard - Show user their voting status, registration details, receipt
- [ ] Add downloadable vote receipt - Generate PDF confirmation after voting
- [ ] Implement accessibility features - ARIA labels, keyboard navigation, screen reader support
- [ ] Add multi-language support - Support all 11 official South African languages
- [ ] Create FAQ/Help section - Common questions about registration and voting process

Code Quality & Architecture
- [ ] Add input validation service - Centralize validation logic (ID numbers, phone numbers, etc.)
- [ ] Implement repository pattern - Abstract data access from controllers
- [ ] Add unit tests - Test voting logic, validation, duplicate vote prevention
- [ ] Add integration tests - Test complete voting flow end-to-end
- [ ] Implement proper error handling - Return meaningful error messages instead of generic NotFound/Conflict
- [ ] Add logging throughout - Use ILogger for debugging and monitoring
- [ ] Create DTOs/ViewModels - Don't expose domain models directly to views
- [ ] Add data seeding for development - Create test users and votes for development environment
- [ ] Implement caching - Cache party list, statistics to reduce DB queries
- [ ] Add database indexes - Index on ApplicationUserId, PartyId, HasVoted for query performance

DevOps & Deployment
- [ ] Set up CI/CD pipeline - Automate testing and deployment
- [ ] Add health check endpoints - Monitor application and database health
- [ ] Implement database backup strategy - Regular automated backups
- [ ] Add application monitoring - Use Application Insights or similar
- [ ] Configure production environment variables - Secure connection strings, API keys
- [ ] Set up staging environment - Test before production deployment
- [ ] Implement database migration strategy - Safe production database updates

Statistics & Reporting (for "cei" site)
- [ ] Create read-only database connection - "cei" site should only read, never write
- [ ] Implement real-time vote counting - Use SignalR for live updates
- [ ] Add historical election data - Store and display past election results
- [ ] Create data visualization components - Charts showing votes by province, party, demographics
- [ ] Add voter turnout statistics - Registered vs actual voters
- [ ] Implement data export - Allow downloading results as CSV/Excel for transparency

(End of TODO)
