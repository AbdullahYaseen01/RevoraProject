# Affiliate Program Documentation

## Overview
The Revara Affiliate Program allows users to earn 25% recurring commissions on every subscription they refer. This comprehensive system includes application management, referral tracking, commission calculations, and payment processing.

## Features Implemented

### 1. Database Schema
- **AffiliateProfile**: Stores affiliate information, commission rates, and approval status
- **Referral**: Tracks individual referrals and their conversion status
- **Commission**: Records all commission payments and their status

### 2. Core Services
- **AffiliateService**: Handles affiliate profile management, stats calculation, and referral tracking
- **CommissionPaymentService**: Manages commission payouts and payment processing
- **ReferralTracking**: Client-side referral link tracking and attribution

### 3. User Interface
- **Affiliate Program Landing Page**: Marketing page with program details
- **Application Form**: Comprehensive affiliate application process
- **Affiliate Dashboard**: Real-time earnings tracking and management
- **Admin Interface**: Management tools for approving/rejecting affiliates
- **Marketing Tools**: Banners, social media posts, and promotional materials

### 4. API Endpoints
- `/api/affiliate/apply` - Submit affiliate application
- `/api/affiliate/profile` - Get affiliate profile
- `/api/affiliate/stats` - Get affiliate statistics
- `/api/affiliate/commissions` - Get commission history
- `/api/affiliate/track` - Track referral
- `/api/affiliate/convert` - Convert referral to commission
- `/api/affiliate/payout` - Request/manage payouts
- `/api/admin/affiliates` - Admin affiliate management
- `/api/affiliate/banner/[size]` - Generate promotional banners

## Page Links for Verification

### Public Pages
1. **Affiliate Program Homepage**
   - URL: `http://localhost:3001/affiliate`
   - Description: Main marketing page with program details, benefits, and signup CTA

2. **Affiliate Application**
   - URL: `http://localhost:3001/affiliate/apply`
   - Description: Application form for new affiliates
   - Requirements: User must be signed in

### Authenticated Pages
3. **Affiliate Dashboard**
   - URL: `http://localhost:3001/affiliate/dashboard`
   - Description: Main dashboard for affiliates to track earnings and manage referrals
   - Requirements: User must be signed in and have an affiliate profile

4. **Admin Affiliate Management**
   - URL: `http://localhost:3001/admin/affiliates`
   - Description: Admin interface for managing affiliate applications
   - Requirements: Admin access (currently open to all authenticated users)

### API Endpoints for Testing
5. **Public Stats API**
   - URL: `http://localhost:3001/api/affiliate/public-stats`
   - Method: GET
   - Description: Returns public statistics about the affiliate program

6. **Banner Generation**
   - URL: `http://localhost:3001/api/affiliate/banner/728x90?ref=TEST123`
   - Method: GET
   - Description: Generates promotional banner with referral code

## Testing Workflow

### 1. Test Affiliate Application
1. Go to `http://localhost:3001/affiliate/apply`
2. Sign in if not already authenticated
3. Fill out the application form
4. Submit and verify success message

### 2. Test Admin Approval
1. Go to `http://localhost:3001/admin/affiliates`
2. View pending applications
3. Approve or reject applications
4. Verify status changes

### 3. Test Affiliate Dashboard
1. After approval, go to `http://localhost:3001/affiliate/dashboard`
2. Verify dashboard loads with affiliate information
3. Check referral link and promo code generation
4. Test marketing tools section

### 4. Test Referral Tracking
1. Copy referral link from dashboard
2. Open in new browser/incognito window
3. Sign up with new account
4. Verify referral is tracked in database

### 5. Test Commission System
1. Create a subscription for referred user
2. Verify commission is created
3. Check commission appears in affiliate dashboard
4. Test payout request functionality

## Commission Structure

### Rates
- **Standard Rate**: 25% recurring commission
- **Minimum Payout**: $10
- **Payment Frequency**: Monthly (1st of each month)

### Example Calculations
- Basic Plan ($29/month) → $7.25/month commission
- Pro Plan ($49/month) → $12.25/month commission
- Enterprise Plan ($99/month) → $24.75/month commission

## Marketing Tools Available

### 1. Banner Ads
- 728x90 Leaderboard
- 300x250 Medium Rectangle
- Auto-generated with referral codes

### 2. Social Media Posts
- Instagram
- Twitter
- Facebook
- LinkedIn
- Pre-written templates with referral links

### 3. Email Templates
- Professional introduction template
- Customizable with affiliate details

## Database Schema Details

### AffiliateProfile
```sql
- id: String (Primary Key)
- userId: String (Foreign Key to User)
- businessType: String
- socialMedia: JSON
- promoCode: String (Unique)
- referralLink: String (Unique)
- commissionRate: Float (Default: 0.25)
- totalEarnings: Float
- isApproved: Boolean
- bankAccountId: String (Stripe Connect)
- createdAt: DateTime
- updatedAt: DateTime
```

### Referral
```sql
- id: String (Primary Key)
- affiliateId: String (Foreign Key to AffiliateProfile)
- referredUserId: String (Foreign Key to User)
- referralCode: String
- status: String (pending, converted, expired)
- conversionDate: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

### Commission
```sql
- id: String (Primary Key)
- affiliateId: String (Foreign Key to AffiliateProfile)
- referralId: String (Foreign Key to Referral)
- subscriptionId: String (Foreign Key to Subscription)
- amount: Float
- rate: Float (Default: 0.25)
- status: String (pending, paid, failed)
- paymentDate: DateTime
- stripePayoutId: String
- createdAt: DateTime
- updatedAt: DateTime
```

## Security Considerations

1. **Authentication**: All affiliate endpoints require user authentication
2. **Authorization**: Admin endpoints should check for admin role
3. **Rate Limiting**: Consider implementing rate limiting for API endpoints
4. **Data Validation**: All input data is validated before processing
5. **SQL Injection**: Using Prisma ORM prevents SQL injection attacks

## Future Enhancements

1. **Stripe Connect Integration**: Full payment processing
2. **Advanced Analytics**: Conversion tracking and performance metrics
3. **Tiered Commissions**: Different rates based on performance
4. **Referral Bonuses**: Additional bonuses for high performers
5. **Automated Marketing**: Email campaigns and social media automation
6. **Mobile App**: Dedicated mobile app for affiliates

## Troubleshooting

### Common Issues
1. **Affiliate not approved**: Check admin panel for pending applications
2. **Referral not tracking**: Verify referral code format and URL structure
3. **Commission not calculating**: Check subscription creation and referral status
4. **Dashboard not loading**: Verify user has affiliate profile

### Debug Steps
1. Check browser console for errors
2. Verify database connections
3. Check API endpoint responses
4. Validate user authentication status
5. Review server logs for errors

## Support

For technical support or questions about the affiliate program:
- Check the documentation above
- Review the API endpoints
- Test with the provided page links
- Contact the development team for assistance
