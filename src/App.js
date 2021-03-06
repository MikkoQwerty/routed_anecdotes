import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect
} from 'react-router-dom'
import './App.css'

const Menu = (props) => {
  const padding = {
    paddingRight: 5
  }
  const anecdoteById = (id) =>
    props.anecdotes.find(a => a.id === id)

  return (
    <div>
      <Router>
        <div>
          <div>
            <Link style={padding} to="/">anecdotes</Link>
            <Link style={padding} to="/new">create new</Link>
            <Link style={padding} to="/about">about</Link>
          </div>
          <Notification notification={props.notification}/>

          <Route exact path="/" render={() => <AnecdoteList anecdotes={props.anecdotes} vote={props.vote} />} />
          <Route path="/new" render={() =>
            props.notification ? 
              <Redirect to="/" /> 
            : 
              <CreateNew addNew={props.addNew} setNotification={props.setNotification} />
          } />
          <Route path="/about" render={() => <About />} />
          <Route exact path="/anecdotes/:id" render={({ match }) =>
            <Anecdote anecdote={anecdoteById(match.params.id)} vote={props.vote} setNotification={props.setNotification} />
          } />
        </div>
      </Router>      
    </div>
  )
}

const AnecdoteList = (props) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {props.anecdotes && props.anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const Anecdote = (props) => {
  const handleVote = (e) => {
    e.preventDefault()
    console.log("voting: ", e.target.id)
    props.vote(e.target.id)
    props.setNotification("Voted!")
    setTimeout(() => {
      props.setNotification(null)
    }, 2000)
  }

  return (
    <div>
      <h2>{props.anecdote.content}</h2>
      <div>{props.anecdote.author}</div>
      <div>{props.anecdote.info}</div>
      <div><strong>{props.anecdote.votes}</strong><button onClick={handleVote} id={props.anecdote.id}>vote</button></div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const Notification = (props) => (
  <div>
    {props.notification && 
      <div className="notification">{props.notification}</div>}
    </div>
)


const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    props.setNotification(content + " Added!")
    setTimeout(() => {
      props.setNotification(null)
    }, 2000)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    console.log("addNew: ", anecdote)
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)
    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu 
        anecdotes={anecdotes} 
        addNew={addNew} 
        setNotification={setNotification}
        notification={notification} 
        vote={vote}
      />
      <Footer />
    </div>
  )
}

export default App;