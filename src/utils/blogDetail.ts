export interface StepDetails {
  title?: string // Optional title for the steps
  steps: string[] // List of steps
}

export interface quote {
  title?: string // Steps for offline setup
  quoteImg?: any // Steps for online setup
  name?: string // Steps for online setup
}

export interface Section {
  id: string // Unique identifier for the section
  heading: string // Heading of the section
  content: string // Main content of the section
  quote?: quote // Status can be an object or a string
  desc?: string // Optional description for the section
  desc2?: string // Optional description for the section
  distinctrange?: string[]
  image?: string
}

export interface Blog {
  id: string | number // Unique identifier for the blog
  title: string // Title of the blog
  date: string // Publication date of the blog
  author: string // Author of the blog
  sections: Section[] // List of sections in the blog
  img: string // Ima
  description: string
}
