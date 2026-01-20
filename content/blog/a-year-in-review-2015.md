---
title:  "A Year in Review: 2015"
date:   "2016-02-05T10:45:30+01:00"
draft:  false
tags:   [Yearly review]
---

2015 is over, so that marks a good moment to look back at last year. 2015 was a 
pretty big year for me, both personally as professionally and also one of the 
most educational yet.
<!--more-->

## Internship Approval

2015 started off with the confirmation that I got an internship of 6 weeks at a Belgian SMB, {{< blank_url "Newtec Cy" "http://www.newtec.eu" >}} during the summer holidays. Then followed by 12 weeks of courses and a large project to conclude my bachelor degree.

## Bachelor Project

In the very first day of the first week of the second semester, we got our bachelor project assignment. The project aimed at constructing a network of BLE sensors to estimate the location of an elderly person. The location accuracy was not required in the sense of a set of 2D or 3D coordinates, but rather an estimation of the room a person was in. To do this, the project mentors suggested to use BLE since it uses very little power. The final goal was to create a watch-like band and a set of tags or beacons that would be placed at fixed locations inside the home. We got 12 weeks to make it all work.

In the end, we did not make the final goal. We only got to an initial prototype of the wristband and were unable to achieve the required accuracy in a wide variety of location environments. In the end, it was a very educational experience: we got to create a PCB in Eagle, write embedded software, perform measurements of signal power... Signal power is also not a very good way of estimating location, a different approach should be taken in an actual design. This is because the signal power of a received signal is very location and time dependent and can fluctuate over 40dBm over distances of half a wavelength. So averaging is required but the system should also perform well for non-moving patients. As a result, accuracy was substandard.

## Holidays and Internship

After the final exams, a 3 month holiday followed. However, 6 weeks of this period were already filled with an internship (at Newtec, as was mentioned above), so calling it a 3 month holiday might be a bit exaggerated.

During this 6-week internship I analyzed and parallelized existing VLDL filter blocks for a new product. It was a very useful experience to see how the knowledge I acquired from different courses (Digital Electronics, Systems and Signals, Communication Techniques and Signal Processing) can be used for real-life applications in industry. A report and final presentation in October concluded the internship with positive feedback from both my promotor and mentor.

## Personal Website

Around the end of September I also launched my personal website. Several months of preparation went into creating the final layout and content for the many blogposts that were published in the subsequent weeks. I really tried to create high quality content that aims at being helpful and enjoyable to read. But because of the _limited_ number of posts I prepared during the holidays (about 10), the past two months have been rather quiet in terms of new blog posts. This is chiefly due the January examinations and holiday I took afterwards.

## Future?

2015 was a really nice year, so let's hope 2016 will be at least on par with 2015. From the initial ideas I have on new projects and blog posts, 2016 will a very good year.
