import InternshipCard from "@/components/InternshipCard";
import Layout from "@/components/Layout";

const sampleInternships = [
  {
    id: "1",
    title: "Full Stack Development",
    company: "TechCorp Solutions",
    isVerified: true,
    location: "Bangalore, India",
    mode: "Hybrid" as const,
    duration: "3 months",
    description: "Work on cutting-edge web applications using React, Node.js, and cloud technologies. Gain hands-on experience in modern development practices.",
    skills: ["React", "Node.js", "JavaScript", "MongoDB", "AWS"],
    deadline: "Jan 15, 2024",
    isPaid: true,
    stipend: "₹15,000/month",
    tags: ["Web Development", "Full Stack", "JavaScript"],
  },
  {
    id: "2",
    title: "Machine Learning Engineer",
    company: "AI Innovations Ltd",
    isVerified: true,
    location: "Mumbai, India",
    mode: "Remote" as const,
    duration: "6 months",
    description: "Develop and deploy machine learning models for real-world applications. Work with cutting-edge AI technologies and learn from industry experts.",
    skills: ["Python", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn"],
    deadline: "Jan 20, 2024",
    isPaid: true,
    stipend: "₹20,000/month",
    tags: ["AI", "Machine Learning", "Python"],
  },
  {
    id: "3",
    title: "Mechanical Design Intern",
    company: "AutoTech Engineering",
    isVerified: true,
    location: "Chennai, India",
    mode: "On-site" as const,
    duration: "4 months",
    description: "Design and prototype automotive components using CAD software. Collaborate with senior engineers on innovative vehicle technologies.",
    skills: ["AutoCAD", "SolidWorks", "CATIA", "Mechanical Design"],
    deadline: "Jan 10, 2024",
    isPaid: true,
    stipend: "₹12,000/month",
    tags: ["Mechanical", "CAD", "Automotive"],
  },
  {
    id: "4",
    title: "Data Science Analyst",
    company: "Analytics Pro",
    isVerified: false,
    location: "Delhi, India",
    mode: "Remote" as const,
    duration: "3 months",
    description: "Analyze large datasets to extract meaningful insights. Work with statistical models and visualization tools to support business decisions.",
    skills: ["Python", "R", "SQL", "Tableau", "Excel"],
    deadline: "Jan 25, 2024",
    isPaid: false,
    tags: ["Data Science", "Analytics", "Statistics"],
  },
  {
    id: "5",
    title: "Mobile App Development",
    company: "AppVenture Studio",
    isVerified: true,
    location: "Hyderabad, India",
    mode: "Hybrid" as const,
    duration: "4 months",
    description: "Build native and cross-platform mobile applications. Learn modern mobile development frameworks and user experience design principles.",
    skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
    deadline: "Jan 30, 2024",
    isPaid: true,
    stipend: "₹18,000/month",
    tags: ["Mobile", "React Native", "Flutter"],
  },
  {
    id: "6",
    title: "Cybersecurity Analyst",
    company: "SecureNet Systems",
    isVerified: true,
    location: "Pune, India",
    mode: "On-site" as const,
    duration: "6 months",
    description: "Learn about network security, threat detection, and incident response. Work with cybersecurity tools and help protect digital infrastructure.",
    skills: ["Network Security", "Penetration Testing", "SIEM", "Python"],
    deadline: "Feb 5, 2024",
    isPaid: true,
    stipend: "₹16,000/month",
    tags: ["Cybersecurity", "Network", "Security"],
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Discover Internships
          </h2>
          <p className="text-muted-foreground">
            Find the perfect internship opportunities that match your skills and interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              {...internship}
              isBookmarked={internship.id === "2" || internship.id === "5"}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
