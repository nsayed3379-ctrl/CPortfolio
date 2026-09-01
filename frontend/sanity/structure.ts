import type { StructureResolver } from "sanity/structure";

// Groups the Studio sidebar to match the site's actual sections
// (Services/Solutions/Products/Work/Labs/Careers/FAQ/Settings) instead of
// Sanity's default flat alphabetical document-type list. Site Settings is
// pinned as a singleton — editing the one real document, never a list of
// many, since a company only has one settings document.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("VecoSoft Content")
    .items([
      S.listItem()
        .title("Website Content")
        .child(
          S.list()
            .title("Website Content")
            .items([
              S.documentTypeListItem("service").title("Services"),
              S.documentTypeListItem("solution").title("Solutions"),
              S.documentTypeListItem("product").title("Products"),
              S.documentTypeListItem("productCategory").title("Product Categories"),
              S.documentTypeListItem("caseStudy").title("Work / Case Studies"),
              S.documentTypeListItem("experiment").title("Labs"),
              S.documentTypeListItem("teamMember").title("Team Members"),
              S.documentTypeListItem("faq").title("FAQs"),
            ])
        ),
      S.listItem()
        .title("Careers")
        .child(
          S.list()
            .title("Careers")
            .items([
              S.documentTypeListItem("job").title("Jobs"),
              S.documentTypeListItem("jobApplication").title("Applications"),
            ])
        ),
      S.listItem()
        .title("Leads")
        .child(
          S.list()
            .title("Leads")
            .items([
              S.documentTypeListItem("contactMessage").title("Contact Messages"),
              S.documentTypeListItem("projectInquiry").title("Project Inquiries"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
    ]);
