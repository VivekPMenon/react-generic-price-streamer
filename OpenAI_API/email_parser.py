import os
import base64
import email
import re
from email import policy
from email.parser import BytesParser

def extract_eml_content(eml_file_path):
    """ Extracts and cleans HTML content from an EML file, embedding images as Base64. """
    
    # Read the EML file
    with open(eml_file_path, "rb") as f:
        msg = BytesParser(policy=policy.default).parse(f)

    html_content = None
    image_dict = {}

    # Extract HTML content and inline images
    for part in msg.walk():
        content_type = part.get_content_type()

        if content_type == "text/html":
            html_content = part.get_payload(decode=True).decode(part.get_content_charset(), errors="ignore")

        elif content_type.startswith("image/"):
            cid = part["Content-ID"]
            if cid:
                cid = cid.strip("<>")  # Remove surrounding angle brackets
                img_data = part.get_payload(decode=True)
                img_format = content_type.split("/")[-1]
                img_base64 = base64.b64encode(img_data).decode("utf-8")
                image_dict[cid] = f"data:image/{img_format};base64,{img_base64}"

    if html_content:
        # Replace image references with inline base64 images
        def replace_img_src(match):
            cid = match.group(1)
            return image_dict.get(cid, match.group(0))  # Replace only if CID exists
        
        html_content = re.sub(r'src=["\']cid:([^"\']+)["\']', lambda m: f'src="{replace_img_src(m)}"', html_content)

        # Clean Outlook-specific Word tags before returning
        return clean_outlook_html(html_content)
    else:
        return None

def clean_outlook_html(html):
    """ Removes Microsoft Word-specific tags, styles, and unnecessary metadata. """
    
    # Remove Word-specific meta tags
    html = re.sub(r'<meta name=["\']?ProgId["\']?[^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name=["\']?Generator["\']?[^>]*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<meta name=["\']?Originator["\']?[^>]*>', '', html, flags=re.IGNORECASE)
    
    # Remove Word-specific style blocks
    html = re.sub(r'<style>[\s\S]*?<\/style>', '', html, flags=re.IGNORECASE)

    # Remove Microsoft Office-specific comments and conditional statements
    html = re.sub(r'<!--[\s\S]*?-->', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<!\[if .*?\]>[\s\S]*?<!\[endif\]>', '', html, flags=re.IGNORECASE)

    # Remove unnecessary inline Word styles
    html = re.sub(r'\bmso-[^:]+:[^;"]+;?', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\bclass=["\']?Mso[^"\']*["\']?', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\bstyle=["\']?mso-[^"\']*["\']?', '', html, flags=re.IGNORECASE)

    # Remove Office namespace declarations
    html = re.sub(r'\bxmlns:w=["\'][^"\']*["\']', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\bxmlns:o=["\'][^"\']*["\']', '', html, flags=re.IGNORECASE)
    html = re.sub(r'\bxmlns:m=["\'][^"\']*["\']', '', html, flags=re.IGNORECASE)

    # Extract only the body content
    body_match = re.search(r'<body[^>]*>([\s\S]*)<\/body>', html, re.IGNORECASE)
    return body_match.group(1) if body_match else html

def save_html(eml_file_path, output_html_path):
    """ Saves the extracted, cleaned, and image-embedded HTML from an EML file. """
    
    html_content = extract_eml_content(eml_file_path)
    
    if html_content:
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"✅ Converted and saved: {output_html_path}")
    else:
        print("❌ No valid HTML content found in the EML file.")

# Example Usage
eml_file = "./5.eml"  # Replace with your EML file path
output_html = "output.html"  # Output file
save_html(eml_file, output_html)
