const BandList = require("./band-list")

class Sockets {

  constructor(io) {

    this.io = io

    this.bandList = new BandList()

    this.socketEvents()

  }

  socketEvents() {

    // On connection
    this.io.on('connection', (socket) => {

      console.log('Cliente conectado')

      // Emitir al cliente conectado todas las bandas actuales
      socket.emit('current-bands', this.bandList.getBands())

      // Escuchar evento de nuevo voto a una banda
      socket.on('vote-band', (id) => {

        this.bandList.increaseVotes(id)

        // Luego de un nuevo voto, volver a emitir el listado de las bandas con el nuevo voto incrementado
        this.io.emit('current-bands', this.bandList.getBands())

      })

      // Escuchar evento para eliminar una banda
      socket.on('delete-band', (id) => {

        this.bandList.removeBand(id)

        // Luego de eliminar una banda, volver a emitir el listado de las bandas
        this.io.emit('current-bands', this.bandList.getBands())

      })

      // Escuchar evento para cambiar el nombre de una banda
      socket.on('change-name', ({ id, name }) => {

        this.bandList.changeBandName(id, name)

        // Luego de cambiar el nombre de una banda, volver a emitir el listado de las bandas
        this.io.emit('current-bands', this.bandList.getBands())

      })

      // Escuchar evento para agregar una nueva banda
      socket.on('add-band', ({ name }) => {

        this.bandList.addBand(name)

        // Luego de agregar la nueva banda, volver a emitir el listado de las bandas
        this.io.emit('current-bands', this.bandList.getBands())

      })

    })

  }

}

module.exports = Sockets