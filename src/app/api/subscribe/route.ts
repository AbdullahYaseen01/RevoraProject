import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@revara.com',
      to: email,
      subject: 'Welcome to Revara - Thank You for Subscribing!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Revara!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Thank You for Subscribing!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We're excited to have you join our community! You'll now receive:
            </p>
            
            <ul style="color: #666; line-height: 1.8;">
              <li>📈 Latest real estate market insights</li>
              <li>💰 Exclusive investment opportunities</li>
              <li>🏠 Property analysis reports</li>
              <li>📊 Market trend updates</li>
              <li>🎯 Platform feature announcements</li>
            </ul>
            
            <p style="color: #666; line-height: 1.6;">
              Stay tuned for valuable content delivered straight to your inbox!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;
                        font-weight: bold;">
                Visit Revara
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't subscribe to our newsletter, please ignore this email.<br>
              © 2024 Revara. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Welcome to Revara!
        
        Thank you for subscribing to our newsletter!
        
        You'll now receive:
        - Latest real estate market insights
        - Exclusive investment opportunities  
        - Property analysis reports
        - Market trend updates
        - Platform feature announcements
        
        Visit us at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}
        
        If you didn't subscribe, please ignore this email.
        
        © 2024 Revara. All rights reserved.
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Subscription successful! Check your email for confirmation.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process subscription. Please try again later.' 
      },
      { status: 500 }
    )
  }
}