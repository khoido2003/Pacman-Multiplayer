package network

import (
	"log"
	"sync"
	"time"
)

// Worker
type Worker struct {
	ID int

	WaitGroup *sync.WaitGroup
}

// Create new worker
func NewWorker(id int, wg *sync.WaitGroup) *Worker {
	return &Worker{
		ID: id,

		WaitGroup: wg,
	}
}

// Start worker
func (w *Worker) Start(JobQueue *chan func()) {

	// Create a new go routine to do the job
	go func() {

		for job := range *JobQueue {

			// if worker running into error
			defer func() {
				if r := recover(); r != nil {
					log.Printf("Worker %d encoutered an error: %v", w.ID, r)
				}
			}()

			log.Printf("Worker %d started job: ", w.ID)

			func() {
				defer func() {
					log.Printf("Worker %d cleaning up resources: ", w.ID)
				}()

				// Start worker to do the job
				job()
			}()

			log.Printf("Worker %d finished job: ", w.ID)

			defer w.WaitGroup.Done()
		}
	}()
}

/////////////////////////////////////////

// Thread pool manager
type Pool struct {
	Workers   []*Worker
	JobQueue  chan func()
	WaitGroup *sync.WaitGroup
}

// Create new thread pool
func NewPool(workerCount int) *Pool {
	pool := &Pool{

		// Allow buffered 1000 jobs before processing
		JobQueue:  make(chan func(), 1000),
		WaitGroup: &sync.WaitGroup{},
	}

	for i := 1; i <= workerCount; i++ {
		worker := NewWorker(i, pool.WaitGroup)

		pool.Workers = append(pool.Workers, worker)
		worker.Start(&pool.JobQueue)
	}
	return pool
}

// Add new job to the pool
func (p *Pool) AddJob(job func()) {
	p.WaitGroup.Add(1)

	// Since add new job into full queue might cause deadlock panic so
	// using a new goroutine to do this

	// Retry sending to the channel with a timeout or a maximum retry limit
	go func() {
		for {
			select {
			case p.JobQueue <- job:
				return // Successfully added job
			default:
				log.Println("JobQueue is full, retrying...")
				time.Sleep(time.Millisecond * 100) // Retry after a short delay
			}
		}
	}()
}

// Stop the worker pool but still wait for all the current job finished before
// shutdown entirely
func (p *Pool) Stop() {
	close(p.JobQueue)
	p.WaitGroup.Wait()
}

// Expose the WaitGroup
func (p *Pool) GetWaitGroup() *sync.WaitGroup {
	return p.WaitGroup
}
