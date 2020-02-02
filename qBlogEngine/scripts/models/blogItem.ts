export class blogItem
{
    category: string;
    name: string;
    tags: string[];
    title: string;
    date: string;

    constructor(category: string, title: string, name: string = "", tags: string[] = [])
    {
        this.title = title;
        this.category = category;
        this.name = name;
        this.tags = tags;
    }
}