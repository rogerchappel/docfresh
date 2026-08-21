# Markdown image links

![Existing image](assets/existing.png)
![Missing image](assets/missing.png)
![External image](https://example.com/image.png)
![Data image](data:image/png;base64,AAAA)
![Query and fragment](assets/existing.png?raw=1#preview)
![Percent encoded](assets/encoded%20image.png)
![Angle destination](<assets/angle image.png>)
![Root relative](/assets/existing.png)
![Escaped parenthesis](assets/escaped\(draft\).png)
![Existing reference][existing]
![Missing reference][missing]

[existing]: assets/existing.png
[missing]: assets/missing-reference.png

Install with `npm install`, then run `npm test`.
