const API = "/api";
const LINK_BAR = "/link-bar";
const NAV_BAR = "/nav-bar";
const HERO_SECTION = "/hero-section";
const WHY_CHOOSE_US = "/why-choose-us";
const FAQ = "/faq";
const PARTNERS = "/partners";
const OUR_SERVICES = "/our-services";
const WORK_FLOW = "/work-flow";
const ACCOMMODATION = "/accommodations";
const DESTINATIONS = "/destinations";
const CATEGORIES = "/categories";
const BLOGS = "/blogs";
const TOUR = "/tour";
const PACKAGES = "/packages";
const REVIEW = "/review";
const USER_LEVEL = "/user-levels";
const USER_BENEFITS = "/user-benefits";
const PROMOTIONS = "/promotions";
const GALLERY = "/gallery";
const ACTIVITIES = "/activities";
const FOOTER = "/footer";
const PLAN_YOUR_TRIP = "/plan-your-trip";
const EMPLOYEES = "/employees";
const INQUIRY = "/inquiry";
const OUR_STORY = "/our-story";
const CONTACT_US = "/contact-us";
const WISH_LIST = "/wish-list";
const AUTH = "/auth";
const USER_PROFILE = "/user-profile";
const HISTORY_MANAGEMENT = "/history-management";
const COUPON = "/coupon";
const USER_NOTIFICATION_PERMISSIONS = "/user-notification-permissions";
const ACCOUNT_SECURITY = "/account-security";
const BOOKING = "/booking";
const BROWSER_HISTORY = "/browser-history";
const OTHERS = "/others";
const COMMON = "/common";
const NOTIFICATIONS = "/notifications";
const VEHICLES = "/vehicles";
const SEASONS = "/seasons";

// Auth
export const LOGIN_FE = `${API}${AUTH}/login`;
export const LOGOUT_FE = `${API}${AUTH}/logout`;
export const SIGNUP_FE = `${API}${AUTH}/signup`;
export const GET_USER_DETAILS_FOR_LOGIN_DATA_FE = `${API}${AUTH}/me`;
export const UPDATE_PASSWORD_DATA_FE = `${API}${AUTH}/change-password`;
export const RESET_PASSWORD_DATA_FE = `${API}${AUTH}/reset-password`;
export const UPDATE_SECRET_QUESTIONS_DATA_FE = `${API}${AUTH}/update-secret-questions`;
export const USERNAME_PASSWORD_VALIDATION_DATA_FE = `${API}${AUTH}/username-password-validation`;
export const GET_ACTIVE_SECRET_QUESTIONS_DATA_FE = `${API}${AUTH}/secret-questions`;
export const GET_SECRET_QUESTIONS_BY_USER_DATA_FE = `${API}${AUTH}/secret-questions-by-user`;

// User Profile
export const UPDATE_USER_PROFILE_DETAILS_DATA_FE = `${API}${USER_PROFILE}/update-user-details`;
export const GET_USER_PROFILE_SIDE_BAR_DATA_FE = `${API}${USER_PROFILE}/side-bar`;
export const GET_USER_PROFILE_USER_DETAILS_DATA_FE = `${API}${USER_PROFILE}/user`;
export const GET_USER_PROFILE_TOUR_REVIEWS_DETAILS_DATA_FE = `${API}${USER_PROFILE}/tour-reviews`;
export const GET_USER_PROFILE_ACTIVITY_REVIEWS_DETAILS_DATA_FE = `${API}${USER_PROFILE}/activity-reviews`;
export const GET_USER_PROFILE_DESTINATION_REVIEWS_DETAILS_DATA_FE = `${API}${USER_PROFILE}/destination-reviews`;
export const GET_USER_PROFILE_PACKAGE_REVIEWS_DETAILS_DATA_FE = `${API}${USER_PROFILE}/package-reviews`;
export const GET_USER_PROFILE_ALL_REVIEWS_DETAILS_DATA_FE = `${API}${USER_PROFILE}/reviews`;
export const GET_USER_PROFILE_WALLET_DETAILS_DATA_FE = `${API}${USER_PROFILE}/wallet`;

// History Management
export const GET_HISTORY_DETAILS_DATA_FE = `${API}${HISTORY_MANAGEMENT}/history-data`;

// Coupons
export const GET_COUPON_DETAILS_DATA_FE = `${API}${COUPON}/user-details`;

// User Notification Permissions
export const GET_USER_NOTIFICATION_DETAILS_DATA_FE = `${API}${USER_NOTIFICATION_PERMISSIONS}/details`;
export const UPDATE_USER_NOTIFICATION_DETAILS_DATA_FE = `${API}${USER_NOTIFICATION_PERMISSIONS}/update`;

// Account Security
export const GET_ACCOUNT_SECURITY_DETAILS_FE = `${API}${ACCOUNT_SECURITY}/details`;
export const REQUEST_MOBILE_VERIFY_SECURITY_DETAILS_FE = `${API}${ACCOUNT_SECURITY}/mobile-verify`;
export const UPDATE_MOBILE_VERIFY_SECURITY_DETAILS_FE = `${API}${ACCOUNT_SECURITY}/mobile-update`;
export const REQUEST_EMAIL_VERIFY_SECURITY_DETAILS_FE = `${API}${ACCOUNT_SECURITY}/email-verify`;
export const UPDATE_EMAIL_VERIFY_SECURITY_DETAILS_FE = `${API}${ACCOUNT_SECURITY}/email-update`;

// Bookings
export const GET_COMPLETED_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/completed`;
export const GET_UPCOMING_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/upcoming`;
export const GET_REQUESTED_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/requested`;
export const GET_CANCELLED_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/cancelled`;
export const GET_PENDING_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/pending`;
export const INSERT_BOOKINGS_INQUIRY_DETAILS_DATA_FE = `${API}${BOOKING}/insert-booking-inquiry`;
export const CANCELLED_PENDING_BOOKINGS_DETAILS_DATA_FE = `${API}${BOOKING}/pending/cancelled`;

// User Benefits
export const GET_ALL_ACTIVE_USER_BENEFITS_FE = `${API}${USER_BENEFITS}`;
export const GET_USER_PROFILE_USER_BENEFITS_DATA_FE = `${API}${USER_BENEFITS}/user-profile`;

// Link Bar
export const GET_ACTIVE_LINK_BAR_DATA = `${API}${LINK_BAR}`;

// Nav Bar
export const GET_ALL_NAV_BAR_DATA = `${API}${NAV_BAR}`;

// Hero Section
export const GET_ACTIVE_HOME_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/home`;
export const GET_ACTIVE_ABOUT_US_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/about-us`;
export const GET_ACTIVE_CONTACT_US_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/contact-us`;
export const GET_ACTIVE_BLOG_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/blog`;
export const GET_ACTIVE_FAQ_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/faq`;
export const GET_ACTIVE_TOUR_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/tour`;
export const GET_ACTIVE_PACKAGE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/package`;
export const GET_ACTIVE_DESTINATION_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/destination`;
export const GET_ACTIVE_ACTIVITY_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/activity`;
export const GET_ACTIVE_PACKAGE_SCHEDULE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/package-schedule`;
export const GET_ACTIVE_BOOKED_TOUR_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/booked-tour`;
export const GET_ACTIVE_VEHICLE_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/vehicle`;
export const GET_ACTIVE_VEHICLE_SPECIFICATION_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/vehicle-specification`;
export const GET_ACTIVE_VEHICLE_TYPES_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/vehicle-types`;
export const GET_ACTIVE_SEASONS_HERO_SECTION_DATA_FE = `${API}${HERO_SECTION}/seasons`;

// Why Choose Us
export const GET_ACTIVE_WHY_CHOOSE_US_DATA_FE = `${API}${WHY_CHOOSE_US}`;

// Our Services
export const GET_ACTIVE_OUR_SERVICES_DATA_FE = `${API}${OUR_SERVICES}`;

// Destinations
export const GET_DESTINATIONS_DETAILS_BY_ID_DATA_FE = `${API}${DESTINATIONS}`;
export const GET_ACTIVE_DESTINATIONS_DATA_FE = `${API}${DESTINATIONS}/active-destinations`;
export const GET_ACTIVE_DESTINATIONS_CATEGORIES_FE = `${API}${DESTINATIONS}${CATEGORIES}`;
export const GET_DESTINATION_CATEGORY_DETAILS_BY_ID_FE = `${API}${DESTINATIONS}/category-details-by-id`;
export const GET_POPULAR_DESTINATIONS_DATA_FE = `${API}${DESTINATIONS}/popular-destinations`;
export const GET_NEW_DESTINATIONS_DATA_FE = `${API}${DESTINATIONS}/new-destinations`;
export const GET_TRENDING_DESTINATIONS_DATA_FE = `${API}${DESTINATIONS}/trending-destinations`;
export const ADD_TRENDING_DESTINATION_DATA_FE = `${API}${DESTINATIONS}/trending-destinations-add`;
export const TERMINATE_TRENDING_DESTINATION_DATA_FE = `${API}${DESTINATIONS}/trending-destinations-terminate`;
export const GET_ACTIVE_DESTINATIONS_FOR_TOUR_MAP_DATA_DE = `${API}${DESTINATIONS}/tour-map`;
export const GET_DESTINATIONS_DETAILS_BY_TOUR_ID_DATA_FE = `${API}${DESTINATIONS}/destinations-by-tour-id`;
export const GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA_FE = `${API}${DESTINATIONS}/destinations-for-request`;
export const GET_DESTINATIONS_HISTORY_DETAILS_DATA_FE = `${API}${DESTINATIONS}/history-details`;
export const GET_DESTINATIONS_HISTORY_IMAGES_DETAILS_DATA_FE = `${API}${DESTINATIONS}/history-images`;
export const GET_DESTINATIONS_REVIEWS_DETAILS_DATA_FE = `${API}${DESTINATIONS}/reviews`;
export const ADD_DESTINATION_DETAILS_DATA_FE = `${API}${DESTINATIONS}/add-destination`;
export const UPDATE_DESTINATION_DETAILS_DATA_FE = `${API}${DESTINATIONS}/update-destination`;
export const GET_DESTINATION_DETAILS_FOR_TERMINATE_DATA_FE = `${API}${DESTINATIONS}/destination-for-terminate`;
export const TERMINATE_DESTINATION_DATA_FE = `${API}${DESTINATIONS}/terminate-destination`;
export const GET_DESTINATION_STATISTICS_DATA_FE = `${API}${DESTINATIONS}/destination-statistics`;
export const GET_DESTINATION_CATEGORIES_STATISTICS_DATA_FE = `${API}${DESTINATIONS}/destination-categories-statistics`;
export const ADD_DESTINATION_CATEGORY_FE = `${API}${DESTINATIONS}/add-destination-category`;
export const UPDATE_DESTINATION_CATEGORY_FE = `${API}${DESTINATIONS}/update-destination-category`;
export const TERMINATE_DESTINATION_CATEGORY_FE = `${API}${DESTINATIONS}/terminate-destination-category`;

// Tours
export const GET_TOUR_DETAILS_BY_ID_DATA_FE = `${API}${TOUR}`;
export const GET_ALL_TOUR_DATA_FE = `${API}${TOUR}`;
export const GET_ACTIVE_TOUR_DATA_FE = `${API}${TOUR}/active-tours`;
export const GET_POPULAR_TOUR_DATA_FE = `${API}${TOUR}/popular`;
export const GET_TOURS_DETAILS_BY_REQUEST_DATA_FE = `${API}${TOUR}/tours-for-request`;
export const GET_TOURS_HISTORY_DETAILS_DATA_FE = `${API}${TOUR}/history`;
export const GET_TOURS_HISTORY_IMAGES_DETAILS_DATA_FE = `${API}${TOUR}/history-images`;
export const GET_TOURS_REVIEWS_DETAILS_DATA_FE = `${API}${TOUR}/reviews`;
export const GET_TOUR_EXTRA_DETAILS_BY_ID_DATA_FE = `${API}${TOUR}/extra-details`;
export const GET_TOUR_DAY_TO_DAY_DETAILS_BY_ID_DATA_FE = `${API}${TOUR}/day-to-day-details`;
export const GET_ALL_TOURS_BASIC_DETAILS_DATA_FE = `${API}${TOUR}/basic-details`;
export const GET_TOUR_MAP_DETAILS_DATA_FE = `${API}${TOUR}/tour-map`;

// Packages
export const GET_ALL_PACKAGES_DETAILS_DATA_FE = `${API}${PACKAGES}`;
export const GET_ACTIVE_PACKAGE_DETAILS_DATA_FE = `${API}${PACKAGES}/active-packages`;
export const GET_PACKAGE_DETAILS_BY_ID_DATA_FE = `${API}${PACKAGES}`;
export const GET_PACKAGE_ALL_DETAILS_BY_ID_DATA_FE = `${API}${PACKAGES}/all-details`;
export const GET_PACKAGES_DETAILS_FOR_REQUEST_DATA_FE = `${API}${PACKAGES}/packages-for-request`;
export const GET_PACKAGE_REVIEWS_DETAILS_DATA_FE = `${API}${PACKAGES}/reviews`;
export const GET_PACKAGE_HISTORY_DETAILS_DATA_FE = `${API}${PACKAGES}/history-details`;
export const GET_PACKAGE_HISTORY_IMAGES_DETAILS_DATA_FE = `${API}${PACKAGES}/history-images`;
export const GET_PACKAGE_DETAILS_BY_TOUR_ID_DATA_FE = `${API}${PACKAGES}/package-details-by-tour-id`;
export const GET_PACKAGE_EXTRA_DETAILS_BY_TOUR_ID_DATA_FE = `${API}${PACKAGES}/package-extra-details-by-tour-id`;
export const GET_PACKAGE_SCHEDULES_DETAILS_BY_TOUR_ID_DATA_FE = `${API}${PACKAGES}/package-schedules-by-tour-id`;
export const GET_PACKAGE_DETAILS_FOR_COMPARE_BY_TOUR_ID_DATA_FE = `${API}${PACKAGES}/compare`;
export const GET_PACKAGE_SCHEDULES_DETAILS_BY_PACKAGE_ID_DATA_FE = `${API}${PACKAGES}/schedule-details`;

// Activities
export const GET_ACTIVITY_DETAILS_BY_ACTIVITY_ID_DATA_FE = `${API}${ACTIVITIES}`;
export const GET_ALL_ACTIVITIES_DETAILS_DATA_FE = `${API}${ACTIVITIES}`;
export const GET_ACTIVE_ACTIVITIES_DETAILS_DATA_FE = `${API}${ACTIVITIES}/active-activities`;
export const GET_ACTIVITIES_DETAILS_BY_REQUEST_DATA_FE = `${API}${ACTIVITIES}/activities-for-request`;
export const GET_ALL_ACTIVITY_CATEGORIES_DATA_FE = `${API}${ACTIVITIES}/category`;
export const GET_ACTIVE_ACTIVITY_CATEGORIES_DATA_FE = `${API}${ACTIVITIES}/category-active`;
export const GET_ACTIVITY_REVIEWS_DETAILS_DATA_FE = `${API}${ACTIVITIES}/reviews-details`;
export const GET_ACTIVITY_HISTORY_DETAILS_DATA_FE = `${API}${ACTIVITIES}/history-details`;
export const GET_ACTIVITY_HISTORY_IMAGES_DETAILS_DATA_FE = `${API}${ACTIVITIES}/history-images`;
export const GET_ACTIVITIES_NAMES_AND_IDS_DATA_FE = `${API}${ACTIVITIES}/activityId-and-activityName`;
export const TERMINATE_ACTIVITY_DATA_FE = `${API}${ACTIVITIES}/terminate-activity`;
export const ADD_ACTIVITY_DATA_FE = `${API}${ACTIVITIES}/add-activity`;
export const UPDATE_ACTIVITY_DATA_FE = `${API}${ACTIVITIES}/update-activity`;
export const GET_ACTIVITIES_STATISTICS_DATA_FE = `${API}${ACTIVITIES}/activities-statistics`;

// Blogs
export const GET_ALL_BLOGS_DETAILS_DATA_FE = `${API}${BLOGS}`;
export const GET_ACTIVE_BLOGS_DETAILS_DATA_FE = `${API}${BLOGS}/active-blogs`;
export const GET_BLOGS_TAG_DETAILS_DATA_FE = `${API}${BLOGS}/blog-tags`;
export const GET_BLOGS_TAG_BY_BLOG_ID_DATA_FE = `${API}${BLOGS}/blog-tags`;
export const GET_BLOGS_DERAILS_BY_WRITER_NAME_DATA_FE = `${API}${BLOGS}/writer`;
export const GET_BLOGS_DERAILS_BY_TAG_NAME_DATA_FE = `${API}${BLOGS}/blog-by-tag-name`;
export const GET_BLOGS_DERAILS_BY_BLOG_ID_DATA_FE = `${API}${BLOGS}/blog-details-by-blog-id`;
export const ADD_BLOG_DATA_FE = `${API}${BLOGS}/add-blog`;
export const ADD_BLOG_BOOKMARK_DATA_FE = `${API}${BLOGS}/add-blog-bookmark`;
export const ADD_BLOG_REACT_DATA_FE = `${API}${BLOGS}/add-react`;
export const ADD_BLOG_COMMENT_REACT_DATA_FE = `${API}${BLOGS}/add-blog-comment-react`;
export const ADD_BLOG_COMMENT_DATA_FE = `${API}${BLOGS}/add-comment-to-blog`;

// Gallery
export const GET_ALL_GALLERY_IMAGES_DATA_FE = `${API}${GALLERY}`;
export const GET_ACTIVE_GALLERY_IMAGES_DATA_FE = `${API}${GALLERY}/active-images`;

// Inquiry
export const ADD_INQUIRY_DATA_FE = `${API}${INQUIRY}/create`;

// Footer
export const GET_ALL_FOOTER_DATA_FE = `${API}${FOOTER}`;
export const GET_ACTIVE_FOOTER_DATA_FE = `${API}${FOOTER}/active`;

// Our Story
export const GET_OUR_STORY_DETAILS_DATA_FE = `${API}${OUR_STORY}/details`;

// Contact Us
export const GET_CONTACT_US_CONTACT_METHODS_DATA_FE = `${API}${CONTACT_US}/contact-methods`;

// Employees
export const GET_EMPLOYEE_DETAILS_BY_TOUR_ID_DATA_FE = `${API}${EMPLOYEES}/employees-details-by-tour-id`;
export const GET_CEO_DETAILS_DATA_FE = `${API}${EMPLOYEES}/ceo-details`;

// FAQ
export const GET_ALL_FAQ_DATA_FE = `${API}${FAQ}`;
export const GET_ACTIVE_FAQ_DATA_FE = `${API}${FAQ}/active`;
export const UPDATE_FAQ_VIEW_COUNT_DATA_FE = `${API}${FAQ}/update-view-count`;
export const GET_FAQ_OPTIONS_DATA_FE = `${API}${FAQ}/options`;
export const ADD_FAQ_REQUEST_DATA_FE = `${API}${FAQ}/insert-faq-request`;

// Wish List
export const ADD_ACTIVITY_WISH_LIST_DATA_FE = `${API}${WISH_LIST}/insert-activity-wish-list`;
export const ADD_DESTINATION_WISH_LIST_DATA_FE = `${API}${WISH_LIST}/insert-destination-wish-list`;
export const ADD_TOUR_WISH_LIST_DATA_FE = `${API}${WISH_LIST}/insert-tour-wish-list`;
export const ADD_PACKAGE_WISH_LIST_DATA_FE = `${API}${WISH_LIST}/insert-package-wish-list`;
export const GET_WIS_LIST_DETAILS_DATA_FE = `${API}${WISH_LIST}/details`;

// Browser History
export const ADD_BROWSER_HISTORY_REQUEST_DATA_FE = `${API}${BROWSER_HISTORY}/add`;

// Common
export const GET_ALL_CATEGORIES_DATA_FE = `${API}${COMMON}/all-categories`;
export const GET_NOTIFICATIONS_DATA_FE = `${API}${NOTIFICATIONS}`;
export const UPDATE_NOTIFICATIONS_READ_DATA_FE = `${API}${NOTIFICATIONS}/notifications-read`;
export const GET_ALL_UNREAD_NOTIFICATION_COUNT_DATA_FE = `${API}${NOTIFICATIONS}/unread-notification-count`;
export const UPDATE_ALL_UNREAD_NOTIFICATIONS_READ_DATA_FE = `${API}${NOTIFICATIONS}/read-all-unread-notifications`;

// Others
export const UPLOAD_IMAGE_TO_CLOUDINARY_FE = `${API}${OTHERS}/save-images`;

// Vehicles
export const GET_VEHICLE_SPECIFICATION_DETAILS_BY_ID_DATA_FE = `${API}${VEHICLES}/specification`;
export const GET_VEHICLE_SPECIFICATION_DETAILS_BY_REQUEST_DATA_FE = `${API}${VEHICLES}/specification`;
export const GET_VEHICLE_SPECIFICATION_FILTERS_DATA_FE = `${API}${VEHICLES}/specification/filters`;
export const GET_VEHICLE_TYPES_DETAILS_DATA_FE = `${API}${VEHICLES}/types`;
export const GET_VEHICLE_TYPES_DETAILS_BY_ID_DATA_FE = `${API}${VEHICLES}/types`;
export const GET_VEHICLE_DETAILS_BY_ID_DATA_FE = `${API}${VEHICLES}/vehicle-details-by-id`;

// Seasons
export const GET_ACTIVE_SEASONS_BASIC_DETAILS_DATA_FE = `${API}${SEASONS}/basic-details`;
export const GET_SEASONS_DETAILS_BY_SEASON_ID_DATA_FE = `${API}${SEASONS}`;

export const GET_TOUR_DETAILS_BY_ID_FE = `${API}${TOUR}/details-by-id`;

export const GET_ALL_PARTNERS = `${API}${PARTNERS}`;

export const GET_ACTIVE_WORK_FLOW_STEPS = `${API}${WORK_FLOW}`;

export const GET_ACTIVE_DESTINATIONS_LOCATIONS_CATEGORIES_FE = `${API}${DESTINATIONS}/locations-categories`;

export const GET_ALL_ACTIVE_REVIEW_FE = `${API}${REVIEW}`;

export const GET_ALL_ACTIVE_USER_LEVEL_FE = `${API}${USER_LEVEL}`;
export const GET_ALL_ACTIVE_USER_LEVEL_WITH_BENEFITS_FE = `${API}${USER_LEVEL}/benefits`;
export const GET_ALL_ACTIVE_PROMOTIONS_FE = `${API}${PROMOTIONS}`;
export const GET_ACTIVE_ACTIVITIES_FE = `${API}${ACTIVITIES}`;
export const GET_ACTIVE_ACTIVITIES_CATEGORIES_FE = `${API}${ACTIVITIES}/categories`;
export const GET_PLAN_YOUR_TRIP_ACTIVE_DESTINATIONS_FE = `${API}${PLAN_YOUR_TRIP}`;
export const GET_PLAN_YOUR_TRIP_DESTINATIONS_TOURS_FE = `${API}${PLAN_YOUR_TRIP}/map`;

// Accommodations
export const GET_AVAILABLE_ACCOMMODATION = `${API}${ACCOMMODATION}`;
export const GET_HOTEL_DETAILS_SECTION_FE = `${API}${ACCOMMODATION}/hotels/deatils-for-section`;
export const GET_RESORT_DETAILS_SECTION_FE = `${API}${ACCOMMODATION}/resorts/deatils-for-section`;
export const GET_VILLA_DETAILS_SECTION_FE = `${API}${ACCOMMODATION}/villas/deatils-for-section`;
export const GET_HOSTEL_DETAILS_SECTION_FE = `${API}${ACCOMMODATION}/hostels/deatils-for-section`;
export const GET_RESTAURANT_DETAILS_SECTION_FE = `${API}${ACCOMMODATION}/restaurants/deatils-for-section`;
