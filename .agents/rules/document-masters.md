# PERMANENT CODEINTERNX DOCUMENT MASTER RULE

THIS IS A PERMANENT PRODUCTION REQUIREMENT FOR ANY AI AGENT WORKING ON THIS REPOSITORY.

Whenever the user asks to generate the "4 certificates", "4 documents", or "internship documents" for any student, you MUST generate the EXACT SAME DOCUMENT DESIGNS that have been approved as the official CodeInternX masters.

The four official documents are:
1. OFFER LETTER
2. INTERNSHIP COMPLETION CERTIFICATE
3. PERFORMANCE REPORT
4. LETTER OF RECOMMENDATION (LOR)

These four designs are now the OFFICIAL CODEINTERNX MASTER DOCUMENTS.

## 1. MASTER TEMPLATES ARE IMMUTABLE
Treat the approved master templates as immutable design assets.
The AI/application MUST NOT redesign, reinterpret, regenerate, restyle, or "improve" the design when generating a document for another student.
The following must remain exactly the same:
- page dimensions
- overall layout
- logo (size, position, instances)
- header, title, borders, lines, shapes, background elements
- colors, typography, font family, font size, font weight, font style
- paragraph structure, spacing, margins
- signature (asset, size, position)
- footer, contact information placement
- document ID, QR-code, certificate ID placement
- table geometry, column widths, row heights
- alignment, visual hierarchy

ONLY dynamic student/internship information may change.

## 2. ONLY THESE VALUES MAY CHANGE
When generating the four documents, only approved dynamic fields may be populated.
Examples: Student Name, Domain, Internship Position, Start Date, End Date, Issue Date, Document ID, Certificate ID, Performance values, remarks, LOR-specific student info.
Everything else must come from the master template.

## 3. NEVER CREATE A NEW DESIGN
When a new student is entered, DO NOT:
- create a new layout, choose a different font, alter spacing, move elements, resize text randomly, redesign paragraphs, create a new signature block, move the signature, create a different logo arrangement, change the table structure, change the QR location, change certificate ID location, change the page proportions.
The student data must be inserted INTO the existing master.
MASTER TEMPLATE + NEW STUDENT DATA = SAME DOCUMENT DESIGN.
NOT: NEW STUDENT DATA + AI GENERATED DESIGN.

## 4. NEVER SILENTLY CHANGE THE MASTER
Do NOT modify an existing master automatically.
If a change is required, it must be explicitly requested and approved by SUPER_ADMIN, and versioned. Existing documents must remain visually identical to their original version.

## 5. EXACT SIGNATURE & LOGO RULES
- Use the approved CodeInternX Shani Bharadwaj signature asset exactly. Do NOT redraw it, replace it with text, duplicate it, or alter its proportions.
- Use the approved CodeInternX logo from the master. There must never be accidental duplicate logos.

## 6. TYPOGRAPHY RULE
Dynamic text must use the typography defined by the master.
Do NOT automatically shrink text simply because a field is longer.
Instead, use the approved text-field rules for wrapping and fitting.
Never produce: merged words, overlapping words, abnormal letter spacing, excessive word spacing, stretched characters, clipped text, overlapping text layers.

## FINAL RULE
From this point forward, WHENEVER THE USER SAYS:
"MAKE THE 4 CERTIFICATES" or "GENERATE THE 4 DOCUMENTS" or "CREATE THE INTERNSHIP DOCUMENTS"
the system MUST ALWAYS use:
1. OFFICIAL OFFER LETTER MASTER
2. OFFICIAL INTERNSHIP COMPLETION CERTIFICATE MASTER
3. OFFICIAL PERFORMANCE REPORT MASTER
4. OFFICIAL LOR MASTER
The four documents must look EXACTLY like the approved masters. Only the student's dynamic information is allowed to change.
NO AI REDESIGN. NO RANDOM LAYOUT. NO NEW TEMPLATE. NO STYLE INTERPRETATION. NO AUTOMATIC REFORMATTING.
MASTER DESIGN = FIXED. STUDENT DATA = VARIABLE.
