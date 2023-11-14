import React, { Component } from 'react'
import ReactQuill, { Quill } from 'react-quill';

// #1 import quill-image-uploader
import { ImageUpload } from 'quill-image-upload';

// #2 register module
Quill.register("modules/imageUpload", ImageUpload);


export default class ReactQuillComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            richContent: ''
        }



        this.Editor = {
            modules: {
                imageUploader: {
                    upload: (file) => {
                        return new Promise((resolve, reject) => {
                            const formData = new FormData();
                            formData.append("image", file);

                            fetch(
                                "https://api.imgbb.com/1/upload?key=334ecea9ec1213784db5cb9a14dac265",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            )
                                .then((response) => response.json())
                                .then((result) => {
                                    console.log(result);
                                    resolve(result.data.url);
                                })
                                .catch((error) => {
                                    reject("Upload failed");
                                    console.error("Error:", error);
                                });
                        });
                    }
                },
                toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                clipboard: {
                    // toggle to add extra line breaks when pasting HTML:
                    matchVisual: false,
                },

            },
            formats: [
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video'
            ],
        };
    }


    handleRichContentChange = (eventContent) => {
        console.log(eventContent)
        this.setState({
            richContent: eventContent
        })
    };

    render() {
        return (
            <ReactQuill id="content" theme="snow"
                modules={this.Editor.modules}
                formats={this.Editor.formats} value={this.state.richContent} onChange={this.handleRichContentChange} />
        )
    }
}
