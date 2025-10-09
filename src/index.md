---
layout: layout.njk
title: Home
---

<div style="display: flex; flex-wrap: wrap; align-items: center; margin-top: 2rem;">
  <div style="flex: 1; text-align: center; min-width: 300px;" class="profile-image-container">
    <picture>
      <!-- Desktop: 300x300 -->
      <source media="(min-width: 768px)" 
              srcset="https://res.cloudinary.com/dvyfstsp3/image/upload/w_300,h_300,c_fill,f_auto,q_auto/v1738454664/rjcylpktsw7tzqaetqhw.jpg" 
              type="image/webp">
      <source media="(min-width: 768px)" 
              srcset="https://res.cloudinary.com/dvyfstsp3/image/upload/w_300,h_300,c_fill,f_auto,q_auto/v1738454664/rjcylpktsw7tzqaetqhw.jpg" 
              type="image/jpeg">
      <!-- Mobile: 250x250 -->
      <source media="(max-width: 767px)" 
              srcset="https://res.cloudinary.com/dvyfstsp3/image/upload/w_250,h_250,c_fill,f_auto,q_auto/v1738454664/rjcylpktsw7tzqaetqhw.jpg" 
              type="image/webp">
      <source media="(max-width: 767px)" 
              srcset="https://res.cloudinary.com/dvyfstsp3/image/upload/w_250,h_250,c_fill,f_auto,q_auto/v1738454664/rjcylpktsw7tzqaetqhw.jpg" 
              type="image/jpeg">
      <!-- Fallback image -->
      <img src="https://res.cloudinary.com/dvyfstsp3/image/upload/w_300,h_300,c_fill,f_auto,q_auto/v1738454664/rjcylpktsw7tzqaetqhw.jpg" 
           alt="Udaysinh Sapate" 
           style="border-radius: 50%; width: 300px; height: 300px; object-fit: cover; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" 
           fetchpriority="high"
           decoding="async">
    </picture>
  </div>
  <div class="hero-text-content" style="flex: 2; padding: 0 1rem; min-width: 300px;">
    <div style="text-align: center;">
      <h1 style="margin: 0; color: var(--text-color);">Udaysinh Sapate</h1>
      <h2 style="margin: 0.5rem 0; color: var(--text-muted-color); font-weight: 400;">Software Developer & AI Specialist | Pune, India</h2>
      <p style="margin: 1rem 0; line-height: 1.6;">I build scalable software solutions and AI systems that solve real problems. Currently working with Python, Golang, and modern web technologies to create applications that perform.</p>
    </div>
  </div>
</div>

<div style="margin: 2rem 0;">
  <h3 style="color: var(--text-color); margin-bottom: 1rem;">What I Do</h3>
  <ul style="list-style-type: none; padding: 0; line-height: 1.8;">
    <li style="margin: 0.5rem 0;">• Develop <u>full-stack applications</u> using <u>React</u>, <u>Node.js</u>, and <u>Python</u></li>
    <li style="margin: 0.5rem 0;">• Build <u>Android applications</u> with <u>Flutter</u> for cross-platform development</li>
    <li style="margin: 0.5rem 0;">• Build and deploy <u>machine learning models</u> with <u>TensorFlow</u> and <u>PyTorch</u></li>
    <li style="margin: 0.5rem 0;">• Write <u>efficient backend systems</u> in <u>Golang</u>, <u>NestJS</u>, and <u>Python</u></li>
    <li style="margin: 0.5rem 0;">• Implement <u>security best practices</u> and conduct <u>penetration testing</u></li>
  </ul>
</div>

<div style="margin: 2rem 0;">
  <h3 style="color: var(--text-color); margin-bottom: 1rem;">Tech Stack</h3>
  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">Python</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">JavaScript</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">Golang</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">C/C++</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">React</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">Node.js</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">TensorFlow</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">PyTorch</span>
    <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">Scikit-learn</span>
  </div>
</div>

<div style="margin: 2rem 0;">
  <h3 style="color: var(--text-color); margin-bottom: 1.5rem;">Experience</h3>
  
  <div style="position: relative;">
    <!-- Continuous Timeline Line -->
    <div style="position: absolute; left: 1.125rem; top: 0; bottom: 0; width: 3px; background: var(--border-color); z-index: 0;"></div>
    
    <!-- Experience Item 1 -->
    <div style="position: relative; padding-left: 3rem; margin-bottom: 2rem; z-index: 1;">
      <div style="position: absolute; left: 0.75rem; top: 0; width: 0.75rem; height: 0.75rem; background: var(--link-color); border: 3px solid var(--background-color); border-radius: 50%; z-index: 2;"></div>
      <div style="padding-bottom: 0.5rem;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <h4 style="margin: 0; color: var(--text-color); font-size: 1.1rem; font-weight: 600;">Full Stack Developer</h4>
            <p style="margin: 0.2rem 0 0 0; color: var(--link-color); font-weight: 500;"><a href="https://www.linkedin.com/company/neev-technologies-gwalior/posts/?feedView=all" target="_blank" rel="noopener noreferrer" style="color: var(--link-color); text-decoration: none;">Neev Technologies</a></p>
          </div>
          <span style="color: var(--text-muted-color); font-size: 0.9rem; font-weight: 500;">May 2025 - Present</span>
        </div>
        <p style="margin: 0.3rem 0; color: var(--text-muted-color); font-size: 0.9rem;">Internship • Pune, Maharashtra (Remote)</p>
        <div style="margin-top: 0.8rem;">
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.3rem;">Front-End Development</span>
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; display: inline-block; margin-bottom: 0.3rem;">Back-End Development</span>
        </div>
      </div>
    </div>
    
    <!-- Experience Item 2 -->
    <div style="position: relative; padding-left: 3rem; margin-bottom: 2rem; z-index: 1;">
      <div style="position: absolute; left: 0.75rem; top: 0; width: 0.75rem; height: 0.75rem; background: var(--border-color); border: 3px solid var(--background-color); border-radius: 50%; z-index: 2;"></div>
      <div style="padding-bottom: 0.5rem;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <h4 style="margin: 0; color: var(--text-color); font-size: 1.1rem; font-weight: 600;">Python (AI and ML) Intern</h4>
            <p style="margin: 0.2rem 0 0 0; color: var(--link-color); font-weight: 500;">LiSYS Technocraft</p>
          </div>
          <span style="color: var(--text-muted-color); font-size: 0.9rem; font-weight: 500;">Mar 2024 - Sep 2024</span>
        </div>
        <p style="margin: 0.3rem 0; color: var(--text-muted-color); font-size: 0.9rem;">Internship • 7 mos • Pune</p>
        <p style="margin: 0.8rem 0; line-height: 1.6; color: var(--text-color);">Contributed to meaningful AI projects including predictive models for patient readmissions. Created and executed AI models emphasizing healthcare analytics, assisted in refining data pipelines, and worked with cross-functional teams to deliver impactful solutions.</p>
        <div style="margin-top: 0.8rem;">
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.3rem;">AI Engineering</span>
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.3rem;">Healthcare Analytics</span>
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; display: inline-block; margin-bottom: 0.3rem;">Data Pipelines</span>
        </div>
      </div>
    </div>
    
    <!-- Experience Item 3 -->
    <div style="position: relative; padding-left: 3rem; z-index: 1;">
      <div style="position: absolute; left: 0.75rem; top: 0; width: 0.75rem; height: 0.75rem; background: var(--border-color); border: 3px solid var(--background-color); border-radius: 50%; z-index: 2;"></div>
      <div style="padding-bottom: 0.5rem;">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <h4 style="margin: 0; color: var(--text-color); font-size: 1.1rem; font-weight: 600;">Chief Executive Officer</h4>
            <p style="margin: 0.2rem 0 0 0; color: var(--link-color); font-weight: 500;">Citta Hub</p>
          </div>
          <span style="color: var(--text-muted-color); font-size: 0.9rem; font-weight: 500;">Dec 2020 - Apr 2022</span>
        </div>
        <p style="margin: 0.3rem 0; color: var(--text-muted-color); font-size: 0.9rem;">Self-employed • 1 yr 5 mos • India</p>
        <div style="margin-top: 0.8rem;">
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.3rem;">Game Development</span>
          <span style="background: var(--tag-background-color); color: var(--tag-text-color); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.85rem; display: inline-block; margin-bottom: 0.3rem;">Artificial Intelligence</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div style="margin: 2rem 0;">
  <h3 style="color: var(--text-color); margin-bottom: 1.5rem;">Current Focus</h3>
  
  <!-- Creative Text Grid Design -->
  <div style="position: relative; margin: 2rem 0; padding: 1.5rem;">
    <!-- Background Pattern -->
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; font-family: monospace; font-size: 0.7rem; line-height: 1.2; color: var(--text-muted-color); overflow: hidden; pointer-events: none;">
      <span>AI ML BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER<br/>
      BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER AI ML<br/>
      CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND<br/>
      ML BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER AI<br/>
      BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER AI ML<br/>
      CYBER AI ML BACKEND CYBER AI ML BACKEND CYBER AI ML BACKEND</span>
    </div>
    
    <!-- Main Content -->
    <div style="position: relative; z-index: 2; background: var(--background-color); padding: 0.5rem;">
      <!-- Focus Areas with ASCII Art Style -->
      <div style="margin-bottom: 2rem;">
        <div style="font-family: monospace; line-height: 1.4; color: var(--text-color);">
          <div style="margin-bottom: 0.8rem;">
            <span style="color: var(--link-color); font-weight: bold;">▶</span> 
            <span style="color: var(--text-color); font-weight: 600;">AI/ML Engineering</span>
            <span style="color: var(--text-muted-color); margin-left: 1rem;">// Building intelligent systems</span>
          </div>
          <div style="margin-bottom: 0.8rem;">
            <span style="color: var(--link-color); font-weight: bold;">▶</span> 
            <span style="color: var(--text-color); font-weight: 600;">Backend Architecture</span>
            <span style="color: var(--text-muted-color); margin-left: 1rem;">// Scalable system design</span>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <span style="color: var(--link-color); font-weight: bold;">▶</span> 
            <span style="color: var(--text-color); font-weight: 600;">Cybersecurity</span>
            <span style="color: var(--text-muted-color); margin-left: 1rem;">// Protecting digital assets</span>
          </div>
        </div>
      </div>
      
      <!-- Status with Creative Border -->
      <div style="position: relative; margin-bottom: 1.5rem;">
        <div style="border: 2px dashed var(--border-color); padding: 1rem; position: relative;">
          <div style="position: absolute; top: -0.6rem; left: 1rem; background: var(--background-color); padding: 0 0.5rem; color: var(--text-muted-color); font-size: 0.8rem; font-weight: 500;">STATUS</div>
          <p style="margin: 0; color: var(--text-color); font-weight: 500;">Available for full-time opportunities and select freelance projects</p>
        </div>
      </div>
      
      <!-- Current Project with Arrow Flow -->
      <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <span style="color: var(--text-muted-color); font-family: monospace; font-size: 1.1rem;">└─</span>
        <span style="color: var(--text-color);">Currently building</span>
        <span style="color: var(--text-muted-color); font-family: monospace;">→</span>
        <a href="https://welabs.in" target="_blank" rel="noopener noreferrer" class="welabs-link" style="color: var(--link-color); text-decoration: none; font-weight: 600; padding: 0.4rem 1rem; border: 2px solid var(--link-color); border-radius: 6px; transition: all 0.3s ease; position: relative; overflow: hidden; display: inline-block;">welabs.in</a>
      </div>
    </div>
  </div>
</div>

<div style="margin: 3rem 0 2rem 0;">
  <h3 style="color: var(--text-color); margin-bottom: 1.5rem;">Explore More</h3>
  
  <!-- Creative Text Grid Design -->
  <div style="position: relative; margin: 2rem 0; padding: 1.5rem;">
    <!-- Background Pattern -->
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.08; font-family: monospace; font-size: 0.7rem; line-height: 1.2; color: var(--text-muted-color); overflow: hidden; pointer-events: none;">
      <span>CREATIVE PROJECTS BLOGS ARTICLES CREATIVE PROJECTS BLOGS ARTICLES<br/>
      PROJECTS BLOGS ARTICLES CREATIVE PROJECTS BLOGS ARTICLES CREATIVE<br/>
      BLOGS ARTICLES CREATIVE PROJECTS BLOGS ARTICLES CREATIVE PROJECTS<br/>
      ARTICLES CREATIVE PROJECTS BLOGS ARTICLES CREATIVE PROJECTS BLOGS<br/>
      CREATIVE PROJECTS BLOGS ARTICLES CREATIVE PROJECTS BLOGS ARTICLES<br/>
      PROJECTS BLOGS ARTICLES CREATIVE PROJECTS BLOGS ARTICLES CREATIVE</span>
    </div>
    
    <!-- Main Content -->
    <div style="position: relative; z-index: 2; background: var(--background-color); padding: 0.5rem;">
      <!-- Navigation Flow -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: var(--text-muted-color); font-family: monospace;">┌─</span>
          <span style="color: var(--text-color);">Dive into my</span>
          <span style="color: var(--text-muted-color); font-family: monospace;">→</span>
          <a href="/creative" class="explore-link" style="color: var(--link-color); text-decoration: none; font-weight: 600; padding: 0.3rem 0.8rem; border: 1px solid var(--link-color); border-radius: 4px; font-family: monospace;">creative()</a>
        </div>
      </div>
      
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: var(--text-muted-color); font-family: monospace;">└─</span>
          <span style="color: var(--text-color);">Read my latest</span>
          <span style="color: var(--text-muted-color); font-family: monospace;">→</span>
          <a href="/blog" class="explore-link" style="color: var(--link-color); text-decoration: none; font-weight: 600; padding: 0.3rem 0.8rem; border: 1px solid var(--link-color); border-radius: 4px; font-family: monospace;">blog.posts</a>
        </div>
      </div>

    </div>

  </div>
</div>
