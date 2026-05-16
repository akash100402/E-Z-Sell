import React from 'react';
import profilePhoto from './10.jpg';
import facebookIcon from './icons/icons8-facebook-48.png'; // Import the Facebook icon
import twitterIcon from './icons/icons8-twitter-48.png'; // Import the Twitter icon
import linkedinIcon from './icons/icons8-linkedin-48.png'; // Import the LinkedIn icon
import instagram from './icons/icons8-instagram-48.png';
import github from './icons/icons8-github-48.png';
import codechef from './icons/codechef.png';

const Footer = () => {
  return (
    <footer className="footer bg-gray-700 text-white px-7 py-3 mt-5" id='footer'>
      <div className="about-section flex justify-between items-center w-full mt-3">
        <div class="flex flex-col">
          <img id="profile-photo" className="w-16 rounded-full" src={profilePhoto} alt="Akash A" />
          {/* <a className='no-underline p-1 bg-lime-400 text-xs rounded-md text-center mt-2' href='#'>Click!</a> */}
        </div>
        <div className="contact-details">
          <h3>ABOUT ME</h3>
          <p>
          I'm a dedicated  MERN stack web developer <br/>
          pursuing MCA. Proficientin creating responsive<br/>
          and user-friendly web applications.
          </p>
        </div>
        <div className='ml-5'>
          <h4>Other Projects</h4>
          <ul>
            <li>Smart Attendance (ML)</li>
            <li>Temperature Control System</li>
            <li>Learn Tube (Web)</li>
          </ul>
        </div>
        <div  className="">
        <a href="https://www.facebook.com/thala.akash.39982">
          <img id='footer-icons' className="mr-4" src={facebookIcon} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/_aakash_.10._/?hl=en">
          <img id='footer-icons' className="mr-4" src={instagram} alt="Instagram" />
        </a>
        <a href="#">
          <img id='footer-icons' src={twitterIcon} alt="Twitter" />
        </a><br/>
        <a href="https://github.com/akash100402">
          <img id='footer-icons' className="mr-4"src={github} alt="Github" />
        </a>
        <a href="https://www.linkedin.com/in/akash-aj10/">
          <img id='footer-icons' className="mr-4" src={linkedinIcon} alt="LinkedIn" />
        </a>
        <a href="https://www.codechef.com/users/akash_leo_10">
          <img id='footer-icons' src={codechef} alt="Code Chef" />
        </a>
        
        {/* Add more social media icons and links as needed */}
      
        </div>
        <div >
      
      <div className=''><p><a href="mailto:aakash10aj@gmail.com" className='no-underline text-white'>📧 aakash10aj@gmail.com</a><br/> 
      &#169;  E-Z Sell@2023<br/>
      📍Chennai-005</p></div>
      </div>
      </div>
    </footer>
    
  );
}

export default Footer;
