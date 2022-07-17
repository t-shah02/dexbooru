
export function parseQuery(query) {
    if (!query.length) {
        return new Set();
    }
    
    const tags = new Set();
    const trimmedQuery = query.trim();
    const parts = trimmedQuery.split(" ");

    let i = 0;
    
    while (i < parts.length) {
        if (parts[i].startsWith('"')) {
           let j = i;
           let quoteTagParts = [];

           while (j < parts.length) {
                quoteTagParts.push(parts[j]);
                if (parts[j].endsWith('"')) {
                    const finalTag = quoteTagParts.join(" ");
                    tags.add(finalTag.replaceAll('"',""));
                    break;
                }
                
                j++;
           } 
           i = j+1;
        }
        else {
            tags.add(parts[i]);
            i++;
        }
    }


    return [...tags];
}
