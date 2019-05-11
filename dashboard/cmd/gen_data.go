package main

import (
	"bytes"
	"fmt"
	"math/rand"
	"strings"
)

var (
	// month names
	months []string = []string{"Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
)

func dataForUri(uri string) string {
	if strings.HasSuffix(uri, "/reported_issues") {
		return reportedIssues()
	} else if strings.HasSuffix(uri, "/revenue_data") {
		return revenueData()
	}
	return "Hello ! " + uri
}

// generate tsv for chart
func reportedIssues() string {
	var buffer bytes.Buffer

	// header
	buffer.WriteString("month\t")
	buffer.WriteString("issue\n")

	for i := 0; i < 12; i++ {
		buffer.WriteString(fmt.Sprintf("%s\t", months[i]))      // month
		buffer.WriteString(fmt.Sprintf("%d\n", rand.Intn(100))) // issue
	}

	return buffer.String()
}

// generate revenue data for chart (in tsv format)
func revenueData() string {
	var buffer bytes.Buffer

	// header
	buffer.WriteString("month\t")
	buffer.WriteString("revenue\n")

	for i := 0; i < 12; i++ {
		buffer.WriteString(fmt.Sprintf("%s\t", months[i]))                  // month
		buffer.WriteString(fmt.Sprintf("%.2f\n", rand.Float64()*1000+1000)) // revenue
	}

	return buffer.String()
}
