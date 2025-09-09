import google.generativeai as genai
import json
import os
from typing import Dict, List, Any

class CampusAIChatbot:
    def __init__(self, api_key: str):
        """Initialize the Campus AI Chatbot with Gemini API."""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.timetable_data = self._load_timetable_data()
        # Load additional campus knowledge
        self.university_overview = self._load_additional_data('university_overview.json')
        self.academic_programs = self._load_additional_data('academic_programs.json')
        self.campus_facilities = self._load_additional_data('campus_facilities.json')
        self.student_services = self._load_additional_data('student_services.json')
        self.events_clubs = self._load_additional_data('events_clubs.json')
        self.anti_ragging = self._load_additional_data('anti_ragging.json')
        self.holidays_2025 = self._load_additional_data('holidays_2025.json')
        self.departmental_contacts = self._load_additional_data('departmental_contacts.json')
        self.hostel_rules = self._load_additional_data('hostel_rules.json')
        self.amenities = self._load_additional_data('amenities.json')
        self.fees_btech_cse = self._load_additional_data('fees_btech_cse.json')
        self.policies = self._load_additional_data('policies.json')
        self._setup_system_prompt()
    
    def _load_timetable_data(self) -> Dict[str, Any]:
        """Load timetable data from JSON file."""
        try:
            # Determine project root (parent of backend)
            project_root = os.path.dirname(os.path.dirname(__file__))

            # Possible locations for timetable.json
            possible_paths = [
                # Correct path for this project structure
                os.path.join(project_root, 'frontend', 'src', 'data', 'timetable.json'),
                # Alternate common layouts
                os.path.join(project_root, 'src', 'data', 'timetable.json'),
                os.path.join(project_root, 'project', 'src', 'data', 'timetable.json'),
            ]

            for timetable_path in possible_paths:
                if os.path.exists(timetable_path):
                    with open(timetable_path, 'r', encoding='utf-8') as f:
                        return json.load(f)
            
            # Fallback: return basic structure
            return {
                "semester": "3",
                "section": "J",
                "program": "B.Tech CSE",
                "weeklySchedule": {},
                "subjects": []
            }
        except Exception as e:
            print(f"Error loading timetable data: {e}")
            return {"error": "Failed to load timetable data"}

    def _load_additional_data(self, filename: str) -> Dict[str, Any]:
        """Load additional campus knowledge JSON files from known locations."""
        try:
            project_root = os.path.dirname(os.path.dirname(__file__))
            possible_paths = [
                os.path.join(project_root, 'frontend', 'src', 'data', filename),
                os.path.join(project_root, 'src', 'data', filename),
                os.path.join(project_root, 'project', 'src', 'data', filename),
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    with open(path, 'r', encoding='utf-8') as f:
                        return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading data file {filename}: {e}")
            return {}
    
    def _setup_system_prompt(self):
        """Set up the system prompt with timetable context."""
        timetable_info = json.dumps(self.timetable_data, indent=2)
        # Prepare concise summaries for additional knowledge
        overview_info = json.dumps(self.university_overview, indent=2)
        programs_info = json.dumps(self.academic_programs, indent=2)
        facilities_info = json.dumps(self.campus_facilities, indent=2)
        services_info = json.dumps(self.student_services, indent=2)
        events_info = json.dumps(self.events_clubs, indent=2)
        anti_ragging_info = json.dumps(self.anti_ragging, indent=2)
        holidays_2025_info = json.dumps(self.holidays_2025, indent=2)
        departmental_info = json.dumps(self.departmental_contacts, indent=2)
        hostel_rules_info = json.dumps(self.hostel_rules, indent=2)
        amenities_info = json.dumps(self.amenities, indent=2)
        fees_btech_cse_info = json.dumps(self.fees_btech_cse, indent=2)
        policies_info = json.dumps(self.policies, indent=2)
        
        self.system_prompt = f"""You are Campus-AI, an intelligent campus assistant for B.Tech CSE students. Your motto is: "CREATE SOLUTIONS THAT MAKE LEARNING AND CAMPUS LIFE SMARTER. FROM CLASSROOM SCHEDULING TO STUDENT HELPDESK CHATBOTS, DIGITAL NOTES, AND SKILL SHOWCASE HUBS — THE OPPORTUNITIES ARE LIMITLESS."

You have access to the following timetable information:
{timetable_info}

You also have campus knowledge to help with general queries:
- University Overview:
{overview_info}

- Academic Programs and Schools:
{programs_info}

- Campus Facilities and Infrastructure:
{facilities_info}

- Student Support Services and Contacts:
{services_info}

- Events, Clubs and Sports:
{events_info}

- Anti-Ragging Handbook (key points):
{anti_ragging_info}

- Holiday List 2025:
{holidays_2025_info}

- Departmental Contacts & HODs:
{departmental_info}

- Hostel Rules, Curfew & Leave:
{hostel_rules_info}

- Canteen Hours & Healthcare:
{amenities_info}

- B.Tech CSE Fees Breakdown:
{fees_btech_cse_info}

- General Policies (Academic, Conduct, Hostel, Facilities, Transport, Safety, Fees, Forms, Support, Discipline):
{policies_info}

Your capabilities include:
1. **Timetable Management**: Answer questions about class schedules, room locations, instructor details, and subject information
2. **Academic Support**: Help with course-related queries, assignment deadlines, and study planning
3. **Campus Navigation**: Provide information about building locations and room numbers
4. **General Campus Life**: Assist with campus facilities, events, and student services

Guidelines:
- Always be helpful, friendly, and professional
- Provide accurate information based on the timetable data
- If you don't have specific information, suggest where students can find it
- Keep responses concise but informative
- Use emojis sparingly and appropriately
- Focus on making campus life easier and more efficient

When students ask about:
- Class schedules: Provide day, time, subject, instructor, and room details
- Room locations: Explain building codes (UB-V, UB-VI, UB-III) and room numbers
- Subjects: Give course codes, instructor names, and schedule information
- General queries: Be helpful and suggest relevant campus resources

Remember: You're here to make campus life smarter and more efficient for students!"""
    
    def chat(self, user_message: str) -> str:
        """Process user message and return AI response."""
        try:
            # Combine system prompt with user message
            full_prompt = f"{self.system_prompt}\n\nStudent: {user_message}\n\nCampus-AI:"
            
            # Generate response using Gemini
            response = self.model.generate_content(full_prompt)
            
            if response.text:
                return response.text.strip()
            else:
                return "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question."
                
        except Exception as e:
            print(f"Error in chatbot chat: {e}")
            return f"I'm experiencing technical difficulties. Error: {str(e)}. Please try again later."
    
    def get_timetable_for_day(self, day: str) -> str:
        """Get timetable for a specific day."""
        day_lower = day.lower().strip()
        weekly_schedule = self.timetable_data.get('weeklySchedule', {})
        
        # Find matching day (case insensitive)
        for schedule_day, classes in weekly_schedule.items():
            if schedule_day.lower() == day_lower:
                if not classes:
                    return f"No classes scheduled for {schedule_day}."
                
                response = f"📅 **{schedule_day} Schedule:**\n\n"
                for class_info in classes:
                    response += f"🕐 **{class_info['time']}**\n"
                    response += f"📚 {class_info['subject']} ({class_info['code']})\n"
                    response += f"👨‍🏫 {class_info['instructor']}\n"
                    response += f"🏢 {class_info['room']}\n\n"
                
                return response
        
        return f"Day '{day}' not found. Available days: {', '.join(weekly_schedule.keys())}"
    
    def get_subject_info(self, subject_name: str) -> str:
        """Get information about a specific subject."""
        subjects = self.timetable_data.get('subjects', [])
        subject_lower = subject_name.lower().strip()
        
        for subject in subjects:
            if (subject['name'].lower() == subject_lower or 
                subject['code'].lower() == subject_lower):
                
                response = f"📚 **{subject['name']} ({subject['code']})**\n"
                response += f"👨‍🏫 Instructor: {subject['instructor']}\n"
                response += f"📖 Type: {subject['type']}\n\n"
                
                # Find schedule for this subject
                weekly_schedule = self.timetable_data.get('weeklySchedule', {})
                schedule_info = []
                
                for day, classes in weekly_schedule.items():
                    for class_info in classes:
                        if (class_info['subject'].lower() == subject['name'].lower() or 
                            class_info['code'].lower() == subject['code'].lower()):
                            schedule_info.append(f"• {day}: {class_info['time']} - {class_info['room']}")
                
                if schedule_info:
                    response += "📅 **Schedule:**\n" + "\n".join(schedule_info)
                else:
                    response += "📅 Schedule information not available."
                
                return response
        
        return f"Subject '{subject_name}' not found. Available subjects: {', '.join([s['name'] for s in subjects])}"
    
    def get_room_info(self, room_query: str) -> str:
        """Get information about rooms and buildings."""
        room_lower = room_query.lower().strip()
        weekly_schedule = self.timetable_data.get('weeklySchedule', {})
        
        # Search for rooms in the schedule
        found_rooms = []
        for day, classes in weekly_schedule.items():
            for class_info in classes:
                if room_lower in class_info['room'].lower():
                    found_rooms.append({
                        'day': day,
                        'time': class_info['time'],
                        'subject': class_info['subject'],
                        'room': class_info['room']
                    })
        
        if found_rooms:
            response = f"🏢 **Room Information for '{room_query}':**\n\n"
            for room_info in found_rooms:
                response += f"📅 {room_info['day']} - {room_info['time']}\n"
                response += f"📚 {room_info['subject']}\n"
                response += f"🏢 {room_info['room']}\n\n"
            return response
        
        return f"No information found for room '{room_query}'. Try searching for specific room numbers or building codes (UB-V, UB-VI, UB-III)."
