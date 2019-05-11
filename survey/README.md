# Survey

Generic survey component

## Usage

This component needs some back-end service to store survey data. You can setup the back-end in a `dataUrl` attribute of the component.

```html
<survey-editor dataUrl="http://localhost:3000/survey/1"></survey-editor>
```


## Survey data

Survey data is just a plain JSON data located somewhere. But you have to format the content as following:

```
{
  "name": "survey name",
  "questions": []
}
```
