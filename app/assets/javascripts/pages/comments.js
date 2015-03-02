/** @jsx React.DOM */
var markdownConverter = new Showdown.converter();

var Comment = React.createClass({
  render: function() {
    var contentMarkdown = markdownConverter.makeHtml((this.props.children || '').toString())

    return (
      <div className="comment">
        <span>
          <b>{this.props.author}: </b>
        </span>

        <span>
          <em>{this.props.content}</em>
        </span>

        <span dangerouslySetInnerHTML={{__html: contentMarkdown}} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(dataItem) {
      return (
        <Comment author={dataItem.author} content={dataItem.content}>
          {dataItem.markdown || ''}
        </Comment>
      )
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  _handleSubmit: function(event) {
    event.preventDefault();

    var form = {
      author: this.refs.author.getDOMNode().value.trim(),
      content: this.refs.content.getDOMNode().value.trim(),
      markdown: this.refs.markdown.getDOMNode().value.trim(),
    }

    if (form.author && form.content) {
      this.refs.author.getDOMNode().value = '';
      this.refs.content.getDOMNode().value = '';
      this.refs.markdown.getDOMNode().value = '';

      $.ajax({
        type: 'POST',
        url: "api/comments",
        data: { comment: form },
        dataType: "json",
        success: function() {
          console.log("comment created success")
        }
      })
    }

  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this._handleSubmit}>
        <input type="text" placeholder="Your name" ref="author"/>
        <input type="text" placeholder="Content of your comment" ref="content" />
        <input type="text" placeholder="markdown (optional)" ref="markdown"/>
        <input type="submit" value="Post" />
      </form>
    )
  }
});

var CommentBox = React.createClass({
  _fetchComments: function() {
    var that = this;

    $.ajax(
      {
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
          that.setState({data: data});
        },
        error: function() {
          console.log("error")
        }
      }
    )
  },
  getInitialState: function() {
    return { data: [] }
  },
  componentDidMount: function() {
    this._fetchComments();
    setInterval(this._fetchComments, this.props.interval || 1500)
  },
  render: function() {
    return (
      <div className="commentBox">
        <CommentList data={this.state.data}/>
        Enter new comment:
        <CommentForm />
      </div>
    );
  }
});
React.render(<CommentBox url="api/comments" />, document.getElementById("content"))